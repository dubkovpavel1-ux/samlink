package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/host"
	"github.com/shirou/gopsutil/v3/mem"
)

// МЕНЯТЬ ПРИ КАЖДОМ РЕЛИЗЕ ВЕРСИИ
const AppVersion = "1.0.1"

type UpdateInfo struct {
	Available      bool   `json:"Available"`
	LatestVersion  string `json:"LatestVersion"`
	CurrentVersion string `json:"CurrentVersion"`
	DownloadURL    string `json:"DownloadURL"`
	ReleaseNotes   string `json:"ReleaseNotes"`
}

type GitHubRelease struct {
	TagName string `json:"tag_name"`
	Body    string `json:"body"`
	Assets  []struct {
		Name               string `json:"name"`
		BrowserDownloadURL string `json:"browser_download_url"`
	} `json:"assets"`
}

func (a *App) CheckForUpdates() UpdateInfo {
	//УРЕПОЗИТОРИЙ ГИТХАБА
	const repo = "dubkovpavel1-ux/samlink"

	resp, err := http.Get("https://api.github.com/repos/" + repo + "/releases/latest")
	if err != nil {
		return UpdateInfo{CurrentVersion: AppVersion}
	}
	defer resp.Body.Close()

	var release GitHubRelease
	if err := json.NewDecoder(resp.Body).Decode(&release); err != nil {
		return UpdateInfo{CurrentVersion: AppVersion}
	}

	latestVersion := strings.TrimPrefix(release.TagName, "v")

	//ищем exe среди assets
	downloadURL := ""
	for _, asset := range release.Assets {
		if strings.HasSuffix(asset.Name, ".exe") {
			downloadURL = asset.BrowserDownloadURL
			break
		}
	}

	isNewer := isVersionNewer(latestVersion, AppVersion)

	return UpdateInfo{
		Available:      isNewer,
		LatestVersion:  latestVersion,
		CurrentVersion: AppVersion,
		DownloadURL:    downloadURL,
		ReleaseNotes:   release.Body,
	}
}

// скачиваем exe и запускает установку
func (a *App) DownloadAndInstall(downloadURL string) string {
	if downloadURL == "" {
		return "Ошибка: URL не указан"
	}

	// Скачиваем во временный файл
	tmpPath := fmt.Sprintf("%s\\samlink_update_%d.exe", os.TempDir(), time.Now().UnixNano())

	resp, err := http.Get(downloadURL)
	if err != nil {
		return fmt.Sprintf("Ошибка скачивания: %v", err)
	}
	defer resp.Body.Close()

	file, err := os.Create(tmpPath)
	if err != nil {
		return fmt.Sprintf("Ошибка создания файла: %v", err)
	}
	defer file.Close()

	_, err = io.Copy(file, resp.Body)
	if err != nil {
		return fmt.Sprintf("Ошибка записи: %v", err)
	}
	file.Close()

	// Запускаем установщик (UAC-промпт появится автоматически)
	cmd := exec.Command("cmd", "/C", "start", "", tmpPath)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	if err := cmd.Start(); err != nil {
		return fmt.Sprintf("Ошибка запуска: %v", err)
	}

	return "" // успех
}

// Сравнение версий: "1.0.1" > "1.0.0"
func isVersionNewer(latest, current string) bool {
	lParts := strings.Split(latest, ".")
	cParts := strings.Split(current, ".")

	for i := 0; i < 3; i++ {
		var l, c int
		if i < len(lParts) {
			l, _ = strconv.Atoi(lParts[i])
		}
		if i < len(cParts) {
			c, _ = strconv.Atoi(cParts[i])
		}
		if l > c {
			return true
		}
		if l < c {
			return false
		}
	}
	return false
}

func (a *App) ApplyDNS(primary string, secondary string) string {
	cmd := fmt.Sprintf(`
$ErrorActionPreference = 'SilentlyContinue'
$adapters = Get-NetAdapter | Where-Object {$_.Status -eq 'Up'}
foreach ($adapter in $adapters) {
    Set-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -ServerAddresses ('%s','%s')
}
`, primary, secondary)

	out, err := runHiddenOutput("powershell",
		"-NonInteractive", "-NoProfile",
		"-ExecutionPolicy", "Bypass",
		"-Command", cmd)
	if err != nil {
		return fmt.Sprintf("Ошибка: %v — %s", err, out)
	}
	return ""
}

func (a *App) ResetDNS() string {
	cmd := `
$ErrorActionPreference = 'SilentlyContinue'
$adapters = Get-NetAdapter | Where-Object {$_.Status -eq 'Up'}
foreach ($adapter in $adapters) {
    Set-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -ResetServerAddresses
}
`
	out, err := runHiddenOutput("powershell",
		"-NonInteractive", "-NoProfile",
		"-ExecutionPolicy", "Bypass",
		"-Command", cmd)
	if err != nil {
		return fmt.Sprintf("Ошибка: %v — %s", err, out)
	}
	return ""
}

func (a *App) GetCurrentDNS() string {
	cmd := `
$ErrorActionPreference = 'SilentlyContinue'
$adapter = Get-NetAdapter | Where-Object {$_.Status -eq 'Up'} | Select-Object -First 1
$dns = (Get-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -AddressFamily IPv4).ServerAddresses
if ($dns) { $dns[0] } else { "" }
`
	out, err := runHiddenOutput("powershell",
		"-NonInteractive", "-NoProfile",
		"-ExecutionPolicy", "Bypass",
		"-Command", cmd)
	if err != nil {
		return ""
	}
	return strings.TrimSpace(out)
}

type App struct {
	ctx context.Context
}

type SystemInfo struct {
	CPUName        string  `json:"CPUName"`
	Cores          int32   `json:"Cores"`
	LogicalCores   int32   `json:"LogicalCores"`
	CPUUsage       float64 `json:"CPUUsage"`
	CPUFreq        float64 `json:"CPUFreq"`
	GPUName        string  `json:"GPUName"`
	GPUMemoryTotal uint64  `json:"GPUMemoryTotal"`
	RAMUsed        uint64  `json:"RAMUsed"`
	RAMTotal       uint64  `json:"RAMTotal"`
	DiskFreeGB     uint64  `json:"DiskFreeGB"`
	DiskTotalGB    uint64  `json:"DiskTotalGB"`
	WinVersion     string  `json:"WinVersion"`
	Hostname       string  `json:"Hostname"`
	Uptime         string  `json:"Uptime"`
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetWindowsUser() (string, error) {
	out, err := runHiddenOutput("powershell", "-NonInteractive", "-NoProfile",
		"-ExecutionPolicy", "Bypass", "-Command",
		"[System.Security.Principal.WindowsIdentity]::GetCurrent().Name")
	if err != nil || strings.TrimSpace(out) == "" {
		h, _ := os.Hostname()
		return h, nil
	}
	return strings.TrimSpace(out), nil
}

func (a *App) GetSystemInfo() SystemInfo {
	info := SystemInfo{}

	cpuInfo, _ := cpu.Info()
	if len(cpuInfo) > 0 {
		info.CPUName = cpuInfo[0].ModelName
		if info.CPUName == "" {
			info.CPUName = cpuInfo[0].VendorID
		}
		info.CPUFreq = cpuInfo[0].Mhz
	}

	cores, _ := cpu.Counts(true)
	logicalCores, _ := cpu.Counts(false)
	info.Cores = int32(cores)
	info.LogicalCores = int32(logicalCores)

	cpuPercent, _ := cpu.Percent(0, false)
	if len(cpuPercent) > 0 {
		info.CPUUsage = cpuPercent[0]
	}

	memInfo, _ := mem.VirtualMemory()
	if memInfo != nil {
		info.RAMTotal = memInfo.Total / 1024 / 1024
		info.RAMUsed = memInfo.Used / 1024 / 1024
	}

	diskInfo, _ := disk.Usage("C:")
	if diskInfo != nil {
		info.DiskTotalGB = diskInfo.Total / 1024 / 1024 / 1024
		info.DiskFreeGB = diskInfo.Free / 1024 / 1024 / 1024
	}

	info.GPUName = getGPUName()
	info.GPUMemoryTotal = getGPUMemory()

	hostInfo, _ := host.Info()
	if hostInfo != nil {
		info.WinVersion = fmt.Sprintf("%s %s", hostInfo.Platform, hostInfo.PlatformVersion)
		uptime := time.Duration(hostInfo.Uptime) * time.Second
		days := int(uptime.Hours()) / 24
		hours := int(uptime.Hours()) % 24
		minutes := int(uptime.Minutes()) % 60
		if days > 0 {
			info.Uptime = fmt.Sprintf("%dд %dч %dм", days, hours, minutes)
		} else {
			info.Uptime = fmt.Sprintf("%dч %dм", hours, minutes)
		}
	}

	info.Hostname, _ = os.Hostname()
	return info
}

func getGPUName() string {
	out, err := runHiddenOutput("powershell", "-NonInteractive", "-NoProfile",
		"-ExecutionPolicy", "Bypass", "-Command",
		"Get-WmiObject Win32_VideoController | Where-Object {$_.CurrentHorizontalResolution -ne $null} | Select-Object -First 1 -ExpandProperty Name")
	if err != nil {
		return "Unknown"
	}
	name := strings.TrimSpace(out)
	if name == "" {
		return "Unknown"
	}
	return name
}

func getGPUMemory() uint64 {
	out, err := runHiddenOutput("powershell", "-NonInteractive", "-NoProfile",
		"-ExecutionPolicy", "Bypass", "-Command",
		"Get-WmiObject Win32_VideoController | Where-Object {$_.CurrentHorizontalResolution -ne $null} | Select-Object -First 1 -ExpandProperty AdapterRAM")
	if err != nil {
		return 0
	}
	var ramBytes uint64
	fmt.Sscanf(strings.TrimSpace(out), "%d", &ramBytes)
	return ramBytes / 1024 / 1024
}

// RunCommand выполняет PowerShell-команду с правами администратора.
func (a *App) RunCommand(command string) string {
	if strings.TrimSpace(command) == "" {
		return "Пустая команда"
	}

	out, err := runPSOutputHidden(command)

	// Считаем успехом если нет ошибки выполнения
	if err == nil {
		// Проверяем только реальные ошибки в выводе
		lower := strings.ToLower(out)
		isRealError := (strings.Contains(lower, "is not recognized") ||
			strings.Contains(lower, "cannot find") ||
			strings.Contains(lower, "access is denied") ||
			strings.Contains(lower, "отказано в доступе") ||
			strings.Contains(lower, "не удается найти"))

		if isRealError {
			// Пробуем с правами администратора
			out2, err2 := runPSElevatedOutputHidden(command)
			if err2 != nil {
				return fmt.Sprintf("Ошибка: %v", err2)
			}
			lower2 := strings.ToLower(out2)
			if strings.Contains(lower2, "access is denied") || strings.Contains(lower2, "отказано") {
				return strings.TrimSpace(out2)
			}
			return "" // успех
		}

		return "" // любой другой вывод = успех
	}

	// err != nil — пробуем с повышением прав
	out2, err2 := runPSElevatedOutputHidden(command)
	if err2 != nil {
		return fmt.Sprintf("Ошибка: %v", err2)
	}
	lower2 := strings.ToLower(out2)
	if strings.Contains(lower2, "access is denied") || strings.Contains(lower2, "отказано") {
		return strings.TrimSpace(out2)
	}
	return "" // успех
}

// ─── Internal helpers ────────────────────────

func runHidden(command string, args ...string) error {
	cmd := exec.Command(command, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow:    true,
		CreationFlags: 0x08000000,
	}
	return cmd.Run()
}

func runHiddenOutput(command string, args ...string) (string, error) {
	cmd := exec.Command(command, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow:    true,
		CreationFlags: 0x08000000,
	}
	out, err := cmd.CombinedOutput()
	return string(out), err
}

func runPSOutputHidden(command string) (string, error) {
	// Экранируем кавычки в команде
	escapedCmd := strings.ReplaceAll(command, `"`, `\"`)
	return runHiddenOutput("powershell",
		"-NonInteractive", "-NoProfile",
		"-ExecutionPolicy", "Bypass",
		"-Command", escapedCmd)
}

// runPSElevatedOutputHidden запускает PowerShell с повышением прав
func runPSElevatedOutputHidden(command string) (string, error) {
	// 1. Создаем временный файл скрипта
	tmpScript := fmt.Sprintf("%s\\samlink_exec_%d.ps1", os.TempDir(), time.Now().UnixNano())
	tmpOutput := fmt.Sprintf("%s\\samlink_out_%d.txt", os.TempDir(), time.Now().UnixNano())

	// Скрипт записывает результат команды в текстовый файл
	scriptContent := fmt.Sprintf(`$res = try { %s } catch { $_.Exception.Message }; $res | Out-File -FilePath '%s' -Encoding UTF8`, command, tmpOutput)
	os.WriteFile(tmpScript, []byte(scriptContent), 0644)
	defer os.Remove(tmpScript)
	defer os.Remove(tmpOutput)

	// 2. Используем PowerShell для запуска скрипта через RunAs (это всё равно вызовет UAC)
	// Убираем -WindowStyle Hidden из ArgumentList, чтобы UAC окно было видно,
	// иначе система может просто убить процесс.
	args := fmt.Sprintf("-NoProfile -ExecutionPolicy Bypass -File \"%s\"", tmpScript)

	cmd := exec.Command("powershell", "-Command", fmt.Sprintf("Start-Process powershell -ArgumentList '%s' -Verb RunAs -Wait", args))

	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}

	// Запускаем и ждем завершения
	err := cmd.Run()

	// 3. Читаем результат
	if data, readErr := os.ReadFile(tmpOutput); readErr == nil {
		return string(data), err
	}

	return "", err
}
