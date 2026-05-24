import { useState, useEffect, useRef } from 'react';
import './App.css';
import { CheckForUpdates, DownloadAndInstall, ApplyDNS, ResetDNS, GetCurrentDNS, GetSystemInfo, RunCommand, GetWindowsUser } from '../wailsjs/go/main/App';
import samlinkLogo from './icons/sl1.png';


const IconCpu    = ({s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></svg>;
const IconGpu    = ({s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7V5M10 7V5M14 7V5M18 7V5M6 17v2M10 17v2M14 17v2M18 17v2"/><circle cx="8" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/></svg>;
const IconRam    = ({s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="8" width="20" height="8" rx="1"/><path d="M6 8V6M9 8V6M12 8V6M15 8V6M18 8V6M6 16v2M9 16v2M12 16v2M15 16v2M18 16v2"/></svg>;
const IconDisk   = ({s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="12" rx="10" ry="6"/><path d="M2 12v4c0 3.31 4.48 6 10 6s10-2.69 10-6v-4"/><circle cx="12" cy="12" r="2"/></svg>;
const IconWin    = ({s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.557L10.5 4.5v7.5H3zM11.5 4.357L21 3v9h-9.5zM3 13H10.5v7.443L3 19.5zM11.5 13H21v8.643L11.5 20.5z"/></svg>;
const IconHome   = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/><path d="M5 10v11h14V10"/></svg>;
const IconOpt    = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
const IconDns    = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>;
const IconCog    = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
const IconCheck  = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>;
const IconNet    = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="8" y="14" width="8" height="8" rx="1"/><path d="M6 10v4M18 10v4M12 14v-4M6 14h12"/></svg>;
const IconSys    = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
const IconPrivacy= ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IconService= ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>;
const IconGaming = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4M15 11h2M15 13h2"/></svg>;
const IconPower  = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10"/></svg>;

function UpdateBanner() {
  const [update, setUpdate] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    CheckForUpdates().then(info => {
      if (info.Available) setUpdate(info);
    });
  }, []);

  if (!update) return null;

  const handleUpdate = async () => {
    setDownloading(true);
    const err = await DownloadAndInstall(update.DownloadURL);
    if (err) alert("Ошибка: " + err);
    setDownloading(false);
  };

  return (
    <div style={{ background: "#1a3a5c", padding: "12px 20px", borderRadius: 8, margin: 16 }}>
      <strong>Доступно обновление v{update.LatestVersion}</strong>
      <p style={{ margin: "4px 0", opacity: 0.8 }}>{update.ReleaseNotes}</p>
      <button onClick={handleUpdate} disabled={downloading}>
        {downloading ? "Скачиваю..." : "Обновить сейчас"}
      </button>
    </div>
  );
}




const TWEAKS = {
  CPU: [
    { id:"cpu1",  label:"Max Performance план",       cmd:`powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c` },
    { id:"cpu2",  label:"Откл. троттлинг Intel",      cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\intelppm" /v Start /t REG_DWORD /d 4 /f` },
    { id:"cpu6",  label:"Откл. AMD Cool'n'Quiet",     cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\amdppm" /v Start /t REG_DWORD /d 4 /f` },
    { id:"cpu8",  label:"PrioritySep: игровой (26)",  cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 26 /f` },
    { id:"cpu14", label:"MMCSS SystemResponsiveness=0",cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f` },
    { id:"cpu15", label:"MMCSS Games: High Priority",  cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v Priority /t REG_DWORD /d 6 /f` },
    { id:"cpu16", label:"MMCSS GPU Priority: 8",       cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f` },
    { id:"cpu17", label:"MMCSS Scheduling: High",      cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d "High" /f` },
    { id:"cpu64", label:"MMCSS SFIO: High",             cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "SFIO Priority" /t REG_SZ /d "High" /f` },
    { id:"cpu66", label:"MMCSS Latency Sensitive",      cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Latency Sensitive" /t REG_SZ /d "True" /f` },
    { id:"cpu19", label:"Turbo Boost Policy: вкл.",     cmd:`powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PERFBOOSTMODE 2` },
    { id:"cpu20", label:"Сеть: без ограничений MMCSS",  cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 0xffffffff /f` },
    { id:"cpu59", label:"[AMD] EPP = 0 (макс. перф.)", cmd:`powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PERFEPP 0` },
    { id:"cpu53", label:"[Intel] Speed Shift EPP = 0",  cmd:`powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PERFEPP 0 && powercfg /setactive scheme_current` },
    { id:"cpu42", label:"Откл. Power Throttling",       cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f` },
    { id:"cpu44", label:"Откл. Xbox Game Bar",          cmd:`reg add "HKCU\\SOFTWARE\\Microsoft\\GameBar" /v UseNexusForGameBarEnabled /t REG_DWORD /d 0 /f && reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 0 /f` },
    { id:"cpu39", label:"Фон: мин. приоритет",          cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Background" /v Priority /t REG_DWORD /d 1 /f` },
    { id:"cpu49", label:"[PUBG] CPU High Priority",     cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\TslGame.exe\\PerfOptions" /v CpuPriorityClass /t REG_DWORD /d 3 /f` },
    { id:"cpu23", label:"[AMD] Ultra Performance план", cmd:`powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 && powercfg /setactive e9a42b02-d5df-448d-aa00-03f14749eb61` },
    { id:"cpu27", label:"Откл. Energy Estimation",      cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v EnergyEstimationEnabled /t REG_DWORD /d 0 /f` },
    { id:"cpu32", label:"Heap DeCommit 256KB",           cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v HeapDeCommitFreeBlockThreshold /t REG_DWORD /d 262144 /f` },
  ],
  GPU: [
    { id:"gpu1",  label:"HAGS вкл.",                    cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f` },
    { id:"gpu2",  label:"Откл. Game DVR",               cmd:`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f` },
    { id:"gpu5",  label:"MSI-режим для GPU (PCIe)",     cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\PCI\\VEN_10DE&DEV_*\\0000\\Device Parameters\\Interrupt Management\\MessageSignaledInterruptProperties" /v MSISupported /t REG_DWORD /d 1 /f` },
    { id:"gpu6",  label:"[NV] Откл. телеметрию",        cmd:`sc config "NvTelemetryContainer" start= disabled && sc stop "NvTelemetryContainer"` },
    { id:"gpu9",  label:"[NV] Prerender: 1 кадр",       cmd:`reg add "HKCU\\SOFTWARE\\NVIDIA Corporation\\Global\\NVTweak" /v PrerenderlLimit /t REG_DWORD /d 1 /f` },
    { id:"gpu12", label:"Откл. D3D Debug Layer",         cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v LoadDebugRuntime /t REG_DWORD /d 0 /f` },
    { id:"gpu14", label:"Откл. прозрачность UI",         cmd:`reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 0 /f` },
    { id:"gpu15", label:"Откл. анимации окон",           cmd:`reg add "HKCU\\Control Panel\\Desktop\\WindowMetrics" /v MinAnimate /t REG_SZ /d 0 /f` },
    { id:"gpu24", label:"TDR Delay: 60с",                cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDelay /t REG_DWORD /d 60 /f` },
    { id:"gpu68", label:"TDR DDI Delay: 60с",            cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDdiDelay /t REG_DWORD /d 60 /f` },
    { id:"gpu27", label:"[NV] ReBAR вкл.",               cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4D36E968-E325-11CE-BFC1-08002BE10318}\\0000" /v "RBAREnable" /t REG_DWORD /d 1 /f` },
    { id:"gpu28", label:"GPU Write Combining вкл.",      cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v EnableWriteCombine /t REG_DWORD /d 1 /f` },
    { id:"gpu39", label:"GPU: макс. мощность",           cmd:`powercfg -setacvalueindex SCHEME_CURRENT SUB_GRAPHICS GPUPREF 2` },
    { id:"gpu41", label:"Эксклюзивный fullscreen",       cmd:`reg add "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f` },
    { id:"gpu47", label:"[NV] Shader Cache: 10 ГБ",     cmd:`reg add "HKCU\\SOFTWARE\\NVIDIA Corporation\\Global\\NVTweak" /v ShaderCacheSize /t REG_DWORD /d 10240 /f` },
    { id:"gpu66", label:"DXR (Raytracing) вкл.",         cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v EnableDXR /t REG_DWORD /d 1 /f` },
  ],
  RAM: [
    { id:"ram2",  label:"Кеш: игровой режим",            cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v LargeSystemCache /t REG_DWORD /d 0 /f` },
    { id:"ram4",  label:"Откл. SysMain (SuperFetch)",    cmd:`sc stop SysMain && sc config SysMain start= disabled` },
    { id:"ram7",  label:"Ядро в RAM (16GB+)",            cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 1 /f` },
    { id:"ram10", label:"Heap DeCommit 256KB",           cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v HeapDeCommitFreeBlockThreshold /t REG_DWORD /d 0x00040000 /f` },
    { id:"ram12", label:"Откл. Memory Compression",     cmd:`powershell -c "Disable-MMAgent -MemoryCompression"` },
    { id:"ram14", label:"Откл. Crash Dump",             cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 0 /f` },
    { id:"ram6",  label:"Pagefile 4GB (для 16GB+)",     cmd:`wmic computersystem where name="%computername%" set AutomaticManagedPagefile=False & wmic pagefileset where name="C:\\\\pagefile.sys" set InitialSize=4096,MaximumSize=4096` },
    { id:"ram19", label:"I/O Page Lock: 16 МБ",         cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v IoPageLockLimit /t REG_DWORD /d 16777216 /f` },
    { id:"ram31", label:"SSD TRIM вкл.",                cmd:`fsutil behavior set DisableDeleteNotify 0` },
  ],
  NETWORK: [
    { id:"net1",  label:"TCP AutoTuning: Normal",        cmd:`netsh int tcp set global autotuninglevel=normal ecncapability=enabled` },
    { id:"net2",  label:"Откл. Nagle (меньше пинг)",    cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /v TcpAckFrequency /t REG_DWORD /d 1 /f` },
    { id:"net19", label:"TCP Fast Open вкл.",            cmd:`netsh int tcp set global fastopen=enabled` },
    { id:"net8",  label:"RSS вкл. (нагрузка по ядрам)", cmd:`netsh int tcp set global rss=enabled` },
    { id:"net14", label:"Портов: 64511",                 cmd:`netsh int ipv4 set dynamicport tcp start=1025 num=64511` },
    { id:"net15", label:"TIME_WAIT: 30с",               cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpTimedWaitDelay /t REG_DWORD /d 30 /f` },
    { id:"net12", label:"DefaultTTL = 64",               cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v DefaultTTL /t REG_DWORD /d 64 /f` },
    { id:"net18", label:"Откл. WPAD (автопрокси)",      cmd:`reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v AutoDetect /t REG_DWORD /d 0 /f` },
    { id:"net25", label:"Сброс DNS кеша",               cmd:`ipconfig /flushdns` },
    { id:"net26", label:"Откл. Teredo туннель",          cmd:`netsh interface teredo set state disabled` },
    { id:"net32", label:"Откл. BITS (фон. загрузки)",   cmd:`sc stop BITS && sc config BITS start= disabled` },
    { id:"net10", label:"Откл. IPv6 (осторожно!)",      cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip6\\Parameters" /v DisabledComponents /t REG_DWORD /d 0xFF /f` },
  ],
  SYSTEM: [
    { id:"sys2",  label:"Откл. Windows Search",          cmd:`sc stop WSearch && sc config WSearch start= disabled` },
    { id:"sys3",  label:"Откл. уведомления",             cmd:`reg add "HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Explorer" /v DisableNotificationCenter /t REG_DWORD /d 1 /f` },
    { id:"sys5",  label:"Откл. Cortana",                 cmd:`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f` },
    { id:"sys6",  label:"WaitToKill: 2с",                cmd:`reg add "HKCU\\Control Panel\\Desktop" /v WaitToKillAppTimeout /t REG_SZ /d 2000 /f` },
    { id:"sys8",  label:"Откл. гибернацию",              cmd:`powercfg -h off` },
    { id:"sys9",  label:"Откл. Lock Screen",             cmd:`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v NoLockScreen /t REG_DWORD /d 1 /f` },
    { id:"sys10", label:"Откл. Fast Startup",            cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f` },
    { id:"sys12", label:"Откл. Error Reporting",         cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 1 /f` },
    { id:"sys20", label:"Откл. Print Spooler",           cmd:`sc stop Spooler && sc config Spooler start= disabled` },
    { id:"sys23", label:"Меню без задержки",             cmd:`reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 0 /f` },
    { id:"sys25", label:"Откл. Sticky Keys диалог",      cmd:`reg add "HKCU\\Control Panel\\Accessibility\\StickyKeys" /v Flags /t REG_SZ /d 506 /f` },
    { id:"sys32", label:"Откл. OneDrive автозапуск",     cmd:`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\OneDrive" /v DisableFileSyncNGSC /t REG_DWORD /d 1 /f` },
    { id:"sys35", label:"[Win11] Откл. Snap Layout",     cmd:`reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v EnableSnapBar /t REG_DWORD /d 0 /f` },
    { id:"sys30", label:"HW UI Acceleration вкл.",       cmd:`reg add "HKCU\\SOFTWARE\\Microsoft\\Avalon.Graphics" /v DisableHWAcceleration /t REG_DWORD /d 0 /f` },
  ],
  PRIVACY: [
    { id:"prv1",  label:"Телеметрия: уровень 0",         cmd:`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 0 /f` },
    { id:"prv2",  label:"Откл. рекламный ID",            cmd:`reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" /v Enabled /t REG_DWORD /d 0 /f` },
    { id:"prv4",  label:"Откл. геолокацию",              cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" /v Value /t REG_SZ /d Deny /f` },
    { id:"prv6",  label:"Откл. DiagTrack",               cmd:`sc stop DiagTrack && sc config DiagTrack start= disabled` },
    { id:"prv7",  label:"Откл. CEIP",                    cmd:`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\SQMClient\\Windows" /v CEIPEnable /t REG_DWORD /d 0 /f` },
    { id:"prv8",  label:"Откл. веб-поиск Cortana",       cmd:`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v DisableWebSearch /t REG_DWORD /d 1 /f` },
    { id:"prv22", label:"Откл. SmartScreen файлы",       cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer" /v SmartScreenEnabled /t REG_SZ /d Off /f` },
    { id:"prv27", label:"Откл. фоновые приложения",      cmd:`reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 1 /f` },
  ],
  SERVICES: [
    { id:"svc1",  label:"Откл. Windows Update (врем.)",  cmd:`sc stop wuauserv && sc config wuauserv start= disabled` },
    { id:"svc2",  label:"Откл. CDPSvc",                  cmd:`sc stop CDPSvc && sc config CDPSvc start= disabled` },
    { id:"svc9",  label:"Откл. Bluetooth",               cmd:`sc stop bthserv && sc config bthserv start= disabled` },
    { id:"svc16", label:"Откл. Xbox Services",            cmd:`sc stop XblAuthManager && sc config XblAuthManager start= disabled && sc stop XblGameSave && sc config XblGameSave start= disabled` },
    { id:"svc19", label:"Откл. SSDP / UPnP",             cmd:`sc stop SSDPSRV && sc config SSDPSRV start= disabled` },
    { id:"svc23", label:"Откл. WER (отчёты ошибок)",    cmd:`sc stop WerSvc && sc config WerSvc start= disabled` },
    { id:"svc25", label:"Откл. Remote Registry",          cmd:`sc stop RemoteRegistry && sc config RemoteRegistry start= disabled` },
    { id:"svc34", label:"Откл. SuperFetch (SysMain)",    cmd:`sc stop sysmain && sc config sysmain start= disabled` },
  ],
  GAMING: [
    { id:"gm3",   label:"Откл. Game Bar",                cmd:`reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 0 /f` },
    { id:"gm6",   label:"DirectStorage вкл.",            cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v D3D12Compatibility /t REG_DWORD /d 1 /f` },
    { id:"gm10",  label:"Откл. Steam Overlay",           cmd:`reg add "HKCU\\SOFTWARE\\Valve\\Steam" /v EnableGameOverlay /t REG_DWORD /d 0 /f` },
    { id:"gm11",  label:"Захват мыши: мгновенный",       cmd:`reg add "HKCU\\Control Panel\\Desktop" /v ForegroundLockTimeout /t REG_DWORD /d 0 /f` },
    { id:"gm16",  label:"Raw Mouse Input (без ускор.)",  cmd:`reg add "HKCU\\Control Panel\\Mouse" /v MouseSpeed /t REG_SZ /d 0 /f && reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold1 /t REG_SZ /d 0 /f && reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold2 /t REG_SZ /d 0 /f` },
    { id:"gm20",  label:"USB Poll Rate: 1 мс",           cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\usbhid\\Parameters" /v PollIntervalMul /t REG_DWORD /d 1 /f` },
    { id:"gm13",  label:"Сброс TCP стека",               cmd:`netsh winsock reset && netsh int ip reset && netsh int tcp reset && ipconfig /flushdns` },
    { id:"gm33",  label:"Принуд. Exclusive Fullscreen",  cmd:`reg add "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f` },
    { id:"gm48",  label:"Game Mode: вкл.",               cmd:`reg add "HKCU\\SOFTWARE\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 1 /f && reg add "HKCU\\SOFTWARE\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 1 /f` },
    { id:"gm41",  label:"⭐ [PUBG] Искл. из Defender",  cmd:`Add-MpPreference -ExclusionProcess "TslGame.exe" && Add-MpPreference -ExclusionPath "C:\\Program Files (x86)\\Steam\\steamapps\\common\\PUBG"` },
    { id:"gm42",  label:"⭐ [PUBG] CPU+IO High Priority",cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\TslGame.exe\\PerfOptions" /v CpuPriorityClass /t REG_DWORD /d 3 /f && reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\TslGame.exe\\PerfOptions" /v IoPriority /t REG_DWORD /d 3 /f` },
    { id:"gm43",  label:"⭐ [PUBG] Откл. FSO",          cmd:`reg add "HKCU\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AppCompatFlags\\Layers" /v "C:\\Program Files (x86)\\Steam\\steamapps\\common\\PUBG\\TslGame\\Binaries\\Win64\\TslGame.exe" /t REG_SZ /d "~ DISABLEDXMAXIMIZEDWINDOWEDMODE" /f` },
  ],
  DISK: [
    { id:"dsk1",  label:"Откл. дефраг SSD",             cmd:`reg add "HKLM\\SOFTWARE\\Microsoft\\Dfrg\\BootOptimizeFunction" /v Enable /t REG_SZ /d N /f` },
    { id:"dsk2",  label:"TRIM вкл.",                     cmd:`fsutil behavior set disabledeletenotify 0` },
    { id:"dsk3",  label:"Откл. 8.3 имена файлов",       cmd:`fsutil behavior set disable8dot3 1` },
    { id:"dsk4",  label:"Откл. Last Access Timestamp",  cmd:`fsutil behavior set disablelastaccess 1` },
    { id:"dsk7",  label:"NTFS Memory Usage: 2",          cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" /v NtfsMemoryUsage /t REG_DWORD /d 2 /f` },
    { id:"dsk16", label:"NTFS: откл. Last Access",      cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" /v NtfsDisableLastAccessUpdate /t REG_DWORD /d 1 /f` },
    { id:"dsk11", label:"Очистить Temp файлы",           cmd:`del /q /f /s %TEMP%\\* && del /q /f /s C:\\Windows\\Temp\\*` },
    { id:"dsk9",  label:"Очистить журналы событий",     cmd:`for /F "tokens=*" %1 in ('wevtutil.exe el') DO wevtutil.exe cl "%1"` },
    { id:"dsk21", label:"Очистить WinSxS",               cmd:`Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase` },
  ],
  POWER: [
    { id:"pwr1",  label:"Создать Ultimate Plan",         cmd:`powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61` },
    { id:"pwr2",  label:"Активировать Ultimate Plan",    cmd:`powercfg /setactive e9a42b02-d5df-448d-aa00-03f14749eb61` },
    { id:"pwr4",  label:"Монитор: не выключать",         cmd:`powercfg /change monitor-timeout-ac 0` },
    { id:"pwr6",  label:"Откл. USB Selective Suspend",  cmd:`powercfg -setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0` },
    { id:"pwr7",  label:"PCIe ASPM: Off",                cmd:`powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPM 0` },
    { id:"pwr8",  label:"GPU: макс. питание",            cmd:`powercfg -setacvalueindex SCHEME_CURRENT SUB_GRAPHICS GPUPREF 2` },
    { id:"pwr9",  label:"Диск: не отключать",            cmd:`powercfg /change disk-timeout-ac 0` },
    { id:"pwr14", label:"Откл. Power Throttling",        cmd:`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f` },
    { id:"pwr18", label:"Откл. Hybrid Sleep",            cmd:`powercfg -setacvalueindex SCHEME_CURRENT SUB_SLEEP HYBRIDSLEEP 0` },
    { id:"pwr21", label:"Применить схему",               cmd:`powercfg /setactive scheme_current` },
    { id:"pwr24", label:"Откл. USB Hub Power Mgmt",     cmd:`powercfg -setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 0853a681-27c8-4100-a2fd-82013e970683 0` },
  ],
};

const TWEAK_CATEGORIES = [
    { key: 'CPU',      label: 'CPU',      Icon: IconCpu      },
    { key: 'GPU',      label: 'GPU',      Icon: IconGpu      },
    { key: 'RAM',      label: 'RAM',      Icon: IconRam      },
    { key: 'NETWORK',  label: 'Network',  Icon: IconNet      },
    { key: 'SYSTEM',   label: 'System',   Icon: IconSys      },
    { key: 'PRIVACY',  label: 'Privacy',  Icon: IconPrivacy  },
    { key: 'SERVICES', label: 'Services', Icon: IconService  },
    { key: 'GAMING',   label: 'Gaming',   Icon: IconGaming   },
    { key: 'DISK',     label: 'Disk',     Icon: IconDisk     },
    { key: 'POWER',    label: 'Power',    Icon: IconPower    },
];

const RESET_CMDS = {
    cpu1:  'powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e',
    cpu2:  'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\intelppm" /v Start /t REG_DWORD /d 3 /f',
    cpu6:  'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\amdppm" /v Start /t REG_DWORD /d 3 /f',
    cpu8:  'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 2 /f',
    cpu14: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 20 /f',
    cpu15: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v Priority /t REG_DWORD /d 2 /f',
    cpu16: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /f 2>nul',
    cpu17: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /f 2>nul',
    cpu64: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "SFIO Priority" /f 2>nul',
    cpu66: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Latency Sensitive" /f 2>nul',
    cpu19: 'powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PERFBOOSTMODE 0',
    cpu20: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /f 2>nul',
    cpu59: 'powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PERFEPP 50',
    cpu53: 'powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PERFEPP 50 && powercfg /setactive scheme_current',
    cpu42: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /f 2>nul',
    cpu44: 'reg add "HKCU\\SOFTWARE\\Microsoft\\GameBar" /v UseNexusForGameBarEnabled /t REG_DWORD /d 1 /f && reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 1 /f',
    cpu39: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Background" /v Priority /t REG_DWORD /d 2 /f',
    cpu49: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\TslGame.exe" /f 2>nul',
    cpu23: 'powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e 2>nul',
    cpu27: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v EnergyEstimationEnabled /t REG_DWORD /d 1 /f',
    cpu32: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v HeapDeCommitFreeBlockThreshold /f 2>nul',
    gpu1:  'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 0 /f',
    gpu2:  'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /f 2>nul',
    gpu5:  'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\PCI\\VEN_10DE&DEV_*\\0000\\Device Parameters\\Interrupt Management\\MessageSignaledInterruptProperties" /v MSISupported /f 2>nul',
    gpu6:  'sc config "NvTelemetryContainer" start= demand 2>nul',
    gpu9:  'reg delete "HKCU\\SOFTWARE\\NVIDIA Corporation\\Global\\NVTweak" /v PrerenderlLimit /f 2>nul',
    gpu12: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v LoadDebugRuntime /f 2>nul',
    gpu14: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 1 /f',
    gpu15: 'reg add "HKCU\\Control Panel\\Desktop\\WindowMetrics" /v MinAnimate /t REG_SZ /d 1 /f',
    gpu24: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDelay /f 2>nul',
    gpu68: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDdiDelay /f 2>nul',
    gpu27: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4D36E968-E325-11CE-BFC1-08002BE10318}\\0000" /v "RBAREnable" /f 2>nul',
    gpu28: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v EnableWriteCombine /f 2>nul',
    gpu39: 'powercfg -setacvalueindex SCHEME_CURRENT SUB_GRAPHICS GPUPREF 0',
    gpu41: 'reg delete "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /f 2>nul',
    gpu47: 'reg delete "HKCU\\SOFTWARE\\NVIDIA Corporation\\Global\\NVTweak" /v ShaderCacheSize /f 2>nul',
    gpu66: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v EnableDXR /f 2>nul',
    ram2:  'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v LargeSystemCache /t REG_DWORD /d 0 /f',
    ram4:  'sc config SysMain start= demand && sc start SysMain 2>nul',
    ram7:  'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 0 /f',
    ram10: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v HeapDeCommitFreeBlockThreshold /f 2>nul',
    ram12: 'powershell -c "Enable-MMAgent -MemoryCompression"',
    ram14: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f',
    ram6:  'wmic computersystem where name="%computername%" set AutomaticManagedPagefile=True',
    ram19: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v IoPageLockLimit /f 2>nul',
    ram31: 'fsutil behavior set DisableDeleteNotify 1',
    net1:  'netsh int tcp set global autotuninglevel=normal ecncapability=disabled',
    net2:  'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /v TcpAckFrequency /f 2>nul',
    net19: 'netsh int tcp set global fastopen=disabled',
    net8:  'netsh int tcp set global rss=disabled',
    net14: 'netsh int ipv4 set dynamicport tcp start=49152 num=16384',
    net15: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpTimedWaitDelay /f 2>nul',
    net12: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v DefaultTTL /t REG_DWORD /d 128 /f',
    net18: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v AutoDetect /t REG_DWORD /d 1 /f',
    net25: 'ipconfig /flushdns',
    net26: 'netsh interface teredo set state default',
    net32: 'sc config BITS start= demand 2>nul',
    net10: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip6\\Parameters" /v DisabledComponents /t REG_DWORD /d 0 /f',
    sys2:  'sc config WSearch start= demand && sc start WSearch 2>nul',
    sys3:  'reg delete "HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Explorer" /v DisableNotificationCenter /f 2>nul',
    sys5:  'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v AllowCortana /t REG_DWORD /d 1 /f',
    sys6:  'reg add "HKCU\\Control Panel\\Desktop" /v WaitToKillAppTimeout /t REG_SZ /d 5000 /f',
    sys8:  'powercfg -h on',
    sys9:  'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v NoLockScreen /f 2>nul',
    sys10: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f',
    sys12: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 0 /f',
    sys20: 'sc config Spooler start= demand 2>nul',
    sys23: 'reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 400 /f',
    sys25: 'reg add "HKCU\\Control Panel\\Accessibility\\StickyKeys" /v Flags /t REG_SZ /d 510 /f',
    sys32: 'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\OneDrive" /v DisableFileSyncNGSC /f 2>nul',
    sys35: 'reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v EnableSnapBar /f 2>nul',
    sys30: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Avalon.Graphics" /v DisableHWAcceleration /t REG_DWORD /d 1 /f',
    prv1:  'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 1 /f',
    prv2:  'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" /v Enabled /t REG_DWORD /d 1 /f',
    prv4:  'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" /v Value /t REG_SZ /d Allow /f',
    prv6:  'sc config DiagTrack start= demand 2>nul',
    prv7:  'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\SQMClient\\Windows" /v CEIPEnable /f 2>nul',
    prv8:  'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v DisableWebSearch /f 2>nul',
    prv22: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer" /v SmartScreenEnabled /t REG_SZ /d Warn /f',
    prv27: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 0 /f',
    svc1:  'sc config wuauserv start= demand 2>nul',
    svc2:  'sc config CDPSvc start= demand 2>nul',
    svc9:  'sc config bthserv start= demand 2>nul',
    svc16: 'sc config XblAuthManager start= demand 2>nul',
    svc19: 'sc config SSDPSRV start= demand 2>nul',
    svc23: 'sc config WerSvc start= demand 2>nul',
    svc25: 'sc config RemoteRegistry start= demand 2>nul',
    svc34: 'sc config sysmain start= demand 2>nul',
    gm3:   'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 1 /f',
    gm6:   'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v D3D12Compatibility /f 2>nul',
    gm10:  'reg add "HKCU\\SOFTWARE\\Valve\\Steam" /v EnableGameOverlay /t REG_DWORD /d 1 /f',
    gm11:  'reg add "HKCU\\Control Panel\\Desktop" /v ForegroundLockTimeout /t REG_DWORD /d 20000 /f',
    gm16:  'reg add "HKCU\\Control Panel\\Mouse" /v MouseSpeed /t REG_SZ /d 1 /f && reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold1 /t REG_SZ /d 6 /f && reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold2 /t REG_SZ /d 10 /f',
    gm20:  'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\usbhid\\Parameters" /v PollIntervalMul /f 2>nul',
    gm13:  'echo skip',
    gm33:  'reg delete "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /f 2>nul',
    gm48:  'reg add "HKCU\\SOFTWARE\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 0 /f && reg add "HKCU\\SOFTWARE\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 0 /f',
    gm41:  'powershell -c "Remove-MpPreference -ExclusionProcess \\"TslGame.exe\\" -ErrorAction SilentlyContinue"',
    gm42:  'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\TslGame.exe" /f 2>nul',
    gm43:  'reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AppCompatFlags\\Layers" /v "C:\\Program Files (x86)\\Steam\\steamapps\\common\\PUBG\\TslGame\\Binaries\\Win64\\TslGame.exe" /f 2>nul',
    dsk1:  'reg add "HKLM\\SOFTWARE\\Microsoft\\Dfrg\\BootOptimizeFunction" /v Enable /t REG_SZ /d Y /f',
    dsk2:  'fsutil behavior set disabledeletenotify 1',
    dsk3:  'fsutil behavior set disable8dot3 0',
    dsk4:  'fsutil behavior set disablelastaccess 0',
    dsk7:  'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" /v NtfsMemoryUsage /t REG_DWORD /d 0 /f',
    dsk16: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" /v NtfsDisableLastAccessUpdate /t REG_DWORD /d 0 /f',
    dsk11: 'echo skip',
    dsk9:  'echo skip',
    dsk21: 'echo skip',
    pwr1:  'echo skip',
    pwr2:  'powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e',
    pwr4:  'powercfg /change monitor-timeout-ac 20',
    pwr6:  'powercfg -setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 1',
    pwr7:  'powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPM 2',
    pwr8:  'powercfg -setacvalueindex SCHEME_CURRENT SUB_GRAPHICS GPUPREF 0',
    pwr9:  'powercfg /change disk-timeout-ac 20',
    pwr14: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /f 2>nul',
    pwr18: 'powercfg -setacvalueindex SCHEME_CURRENT SUB_SLEEP HYBRIDSLEEP 1',
    pwr21: 'powercfg /setactive scheme_current',
    pwr24: 'powercfg -setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 0853a681-27c8-4100-a2fd-82013e970683 2',
};

// ─── Optimization Tab ───────────────────────
function OptimizationTab() {
    const [activeCategory, setActiveCategory] = useState('CPU');
    const [showConfirm, setShowConfirm]       = useState(false);
    const [applied, setApplied] = useState(() => {
        try { const s = localStorage.getItem('appliedTweaks'); return s ? JSON.parse(s) : {}; }
        catch { return {}; }
    });
    const [loadingMap, setLoadingMap] = useState({});
    const [toast, setToast]           = useState('');
    const [search, setSearch]         = useState('');
    const [resetting, setResetting]   = useState(false);

    useEffect(() => {
        try { localStorage.setItem('appliedTweaks', JSON.stringify(applied)); } catch {}
    }, [applied]);

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

    async function applyTweak(tweak) {
        if (applied[tweak.id]) return;
        setLoadingMap(prev => ({ ...prev, [tweak.id]: true }));
        try {
            const result = await RunCommand(tweak.cmd);
            if (result === '') {
                setApplied(prev => ({ ...prev, [tweak.id]: true }));
                showToast(`✓ ${tweak.label}`);
            } else {
                showToast(`✗ ${result.substring(0, 50)}`);
            }
        } catch (err) {
            showToast(`✗ Ошибка: ${err.message}`);
        } finally {
            setLoadingMap(prev => ({ ...prev, [tweak.id]: false }));
        }
    }

    async function applyAll() {
        const tweaks = search ? allTweaks : TWEAKS[activeCategory];
        let i = 0;
        for (const tweak of tweaks) {
            if (!applied[tweak.id]) { setTimeout(() => applyTweak(tweak), i * 150); i++; }
        }
    }

    function resetAllTweaks() {
        setShowConfirm(true);
    }

    async function doReset() {
        setShowConfirm(false);
        setResetting(true);
        let ok = 0, fail = 0;
        const ids = Object.keys(applied).filter(id => applied[id]);
        showToast(`Сброс ${ids.length} твиков...`);
        for (const id of ids) {
            const cmd = RESET_CMDS[id];
            if (cmd && cmd !== 'echo skip') {
                try {
                    await RunCommand(cmd);
                    ok++;
                    setApplied(prev => { const n = { ...prev }; delete n[id]; return n; });
                } catch { fail++; }
            }
            await new Promise(r => setTimeout(r, 50));
        }
        try { await RunCommand('powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e'); } catch {}
        showToast(fail > 0 ? `Сброшено: ${ok}, ошибок: ${fail}` : `Все ${ok} твиков сброшены. Перезагрузите ПК.`);
        setResetting(false);
    }

    const allTweaks = search
        ? Object.values(TWEAKS).flat().filter(t => t.label.toLowerCase().includes(search.toLowerCase()))
        : TWEAKS[activeCategory];

    const totalCount   = Object.values(TWEAKS).flat().length;
    const appliedCount = Object.keys(applied).filter(k => applied[k]).length;

    return (
        <div className="tab-content">
            {toast && <div className="toast">{toast}</div>}

            {/* ─── Кастомная модалка вместо confirm() ─── */}
            {showConfirm && (
                <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-icon">⟳</div>
                        <h3 className="modal-title">Сброс всех твиков</h3>
                        <p className="modal-desc">
                            Все применённые оптимизации будут откатаны к стандартным настройкам Windows.
                            Это может потребовать перезагрузки.
                        </p>
                        <div className="modal-actions">
                            <button className="modal-btn-cancel" onClick={() => setShowConfirm(false)}>Отмена</button>
                            <button className="modal-btn-confirm" onClick={doReset}>Сбросить</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="tab-header-row">
                <div>
                    <h2 className="mainbar-title">Оптимизация</h2>
                    <p className="tab-desc">Твики производительности · {appliedCount}/{totalCount} применено</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input className="opt-search" placeholder="🔍 Поиск..." value={search} onChange={e => setSearch(e.target.value)} />
                    <button className="btn-secondary" onClick={applyAll}>Применить все</button>
                    <button
                        className="btn-secondary"
                        onClick={resetAllTweaks}
                        disabled={resetting || appliedCount === 0}
                        style={{ borderColor: 'rgba(255,92,124,0.5)', color: '#ff5c7c', background: 'rgba(255,92,124,0.1)' }}
                    >
                        {resetting ? <span className="spinner" /> : '⟳ Сбросить все'}
                    </button>
                </div>
            </div>

            {!search && (
                <div className="opt-categories">
                    {TWEAK_CATEGORIES.map(({ key, label, Icon }) => {
                        const count = TWEAKS[key].length;
                        const done  = TWEAKS[key].filter(t => applied[t.id]).length;
                        return (
                            <button key={key} className={`opt-cat-btn ${activeCategory === key ? 'active' : ''}`} onClick={() => setActiveCategory(key)}>
                                <Icon /> {label}
                                <span className="opt-cat-count">{done}/{count}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="tweaks-list">
                {allTweaks.map(tweak => (
                    <div key={tweak.id} className={`tweak-row ${applied[tweak.id] ? 'applied' : ''}`}>
                        <div className="tweak-info">
                            <span className="tweak-label">{tweak.label}</span>
                        </div>
                        <button
                            className={`btn-tweak ${applied[tweak.id] ? 'done' : ''}`}
                            onClick={() => applyTweak(tweak)}
                            disabled={applied[tweak.id] || loadingMap[tweak.id]}
                        >
                            {loadingMap[tweak.id] ? <span className="spinner" /> : applied[tweak.id] ? <><IconCheck /> Применено</> : 'Применить'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── DNS Tab ────────────────────────────────
const DNS_PRESETS = [
    { name: 'Cloudflare', primary: '1.1.1.1',       secondary: '1.0.0.1',       tag: 'Быстрый'     },
    { name: 'Google',     primary: '8.8.8.8',       secondary: '8.8.4.4',       tag: 'Стабильный'  },
    { name: 'NextDNS',    primary: '45.90.28.0',    secondary: '45.90.30.0',    tag: 'Без рекламы' },
    { name: 'AdGuard',    primary: '94.140.14.14',  secondary: '94.140.15.15',  tag: 'Безопасный'  },
    { name: 'Quad9',      primary: '9.9.9.9',       secondary: '149.112.112.112', tag: 'Приватный' },
];

function DnsTab() {
    const [active, setActive]       = useState(null);
    const [loading, setLoading]     = useState(null);
    const [detecting, setDetecting] = useState(true);
    const [toast, setToast]         = useState('');

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

    useEffect(() => {
        detectCurrentDns();
    }, []);

    async function detectCurrentDns() {
        setDetecting(true);
        try {
            const currentDns = await GetCurrentDNS();
            const matched = DNS_PRESETS.find(p => p.primary === currentDns.trim());
            setActive(matched ? matched.name : null);
        } catch {}
        finally { setDetecting(false); }
    }

    async function applyDns(preset) {
        // Если уже активен — сбрасываем
        if (active === preset.name) {
            setLoading('reset');
            try {
                const err = await ResetDNS();
                if (err) { showToast(`✗ ${err}`); }
                else { setActive(null); showToast('✓ DNS сброшен на автоматический'); }
            } catch (e) { showToast(`✗ ${e.message}`); }
            finally { setLoading(null); }
            return;
        }

        setLoading(preset.name);
        try {
            const err = await ApplyDNS(preset.primary, preset.secondary);
            if (err) { showToast(`✗ ${err}`); }
            else { setActive(preset.name); showToast(`✓ DNS ${preset.name} применён`); }
        } catch (e) { showToast(`✗ ${e.message}`); }
        finally { setLoading(null); }
    }

    return (
        <div className="tab-content">
            {toast && <div className="toast">{toast}</div>}
            <div className="tab-header-row">
                <div>
                    <h2 className="mainbar-title">DNS</h2>
                    <p className="tab-desc">
                        Управление DNS · меньше пинг до серверов
                        {detecting && <span style={{opacity:0.5, marginLeft:8}}>· определяем текущий...</span>}
                        {active && !detecting && <span style={{opacity:0.7, marginLeft:8}}>· активен: {active}</span>}
                    </p>
                </div>
                {active && (
                    <button
                        className="btn-secondary"
                        onClick={() => applyDns(DNS_PRESETS.find(p => p.name === active))}
                        disabled={loading !== null}
                        style={{ borderColor: 'rgba(255,92,124,0.5)', color: '#ff5c7c', background: 'rgba(255,92,124,0.1)' }}
                    >
                        {loading === 'reset' ? <span className="spinner" /> : '✕ Сбросить DNS'}
                    </button>
                )}
            </div>
            <div className="dns-list">
                {DNS_PRESETS.map(p => (
                    <div key={p.name} className={`dns-row ${active === p.name ? 'active' : ''}`}>
                        <div className="dns-info">
                            <span className="dns-name">{p.name}</span>
                            <span className="dns-addr">{p.primary} / {p.secondary}</span>
                            <span className="dns-tag">{p.tag}</span>
                        </div>
                        <button
                            className={`btn-tweak ${active === p.name ? 'done' : ''}`}
                            onClick={() => applyDns(p)}
                            disabled={loading !== null || detecting}
                        >
                            {loading === p.name ? <span className="spinner" />
                             : active === p.name ? '✓ Активен (откл.)'
                             : 'Применить'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Settings Tab ───────────────────────────
function SettingsTab() {
    return (
        <div className="tab-content">
            <div className="tab-header-row">
                <div>
                    <h2 className="mainbar-title">Параметры</h2>
                    <p className="tab-desc">Настройки приложения</p>
                </div>
            </div>
            <div className="section-box">
                <div className="section-title">О программе</div>
                <p className="tab-desc" style={{padding: '12px 0'}}>Samlink System Optimizer · Версия 1.0.1</p>
            </div>
        </div>
    );
}

// ─── Dashboard ──────────────────────────────
function StatBar({ value, max = 100, color = 'var(--accent)' }) {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div className="stat-bar-bg">
            <div className="stat-bar-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
    );
}

function Dashboard({ info }) {
    if (!info) return <div className="tab-content"><p className="loading-text">Загрузка системной информации...</p></div>;

    const cpuPercent  = info.CPUUsage?.toFixed(1) || '0';
    const ramPercent  = ((info.RAMUsed / info.RAMTotal) * 100).toFixed(1);
    const diskPercent = (((info.DiskTotalGB - info.DiskFreeGB) / info.DiskTotalGB) * 100).toFixed(1);

    const getColor = (pct) => pct < 30 ? 'var(--success)' : pct < 70 ? 'var(--warning)' : 'var(--error)';

    return (
        <div className="tab-content">
            <div className="tab-header-row">
                <div>
                    <h2 className="mainbar-title">Системный монитор</h2>
                    <p className="tab-desc">Обновление каждые 2 секунды</p>
                </div>
                <div className="live-badge"><span className="live-dot" />LIVE</div>
            </div>

            <div className="dashboard-grid">
                <div className="section-box glass-card">
                    <div className="section-title"><IconCpu s={16} />Процессор<span className="chip">{info.CPUName?.split(' ').slice(0,2).join(' ') || 'CPU'}</span></div>
                    <div className="stat-group">
                        <div className="stat-item"><div className="stat-header"><span className="stat-label">Модель</span><span className="stat-value-highlight">{info.CPUName || '—'}</span></div></div>
                        <div className="stat-grid-2">
                            <div className="stat-item"><span className="stat-label">Ядра</span><div className="stat-value-group"><span className="stat-value-large">{info.Cores}</span><span className="stat-value-large">/{info.LogicalCores}</span></div></div>
                            <div className="stat-item"><span className="stat-label">Частота</span><div className="stat-value-group"><span className="stat-value-large">{info.CPUFreq}</span><span className="stat-value-sub">МГц</span></div></div>
                        </div>
                        <div className="stat-item">
                            <div className="progress-wrapper">
                                <div className="progress-label">
                                    <span>{cpuPercent}%</span>
                                    <span className="progress-status">{cpuPercent < 30 ? '🟢 Низкая' : cpuPercent < 70 ? '🟡 Средняя' : '🔴 Высокая'}</span>
                                </div>
                                <StatBar value={info.CPUUsage} max={100} color={getColor(cpuPercent)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-box glass-card">
                    <div className="section-title"><IconGpu s={16} />Видеокарта<span className="chip">GPU</span></div>
                    <div className="stat-group">
                        <div className="stat-item"><div className="stat-header"><span className="stat-label">Модель</span><span className="stat-value-highlight">{info.GPUName || '—'}</span></div></div>
                        <div className="stat-item"><span className="stat-label">Видеопамять</span><div className="stat-value-group"><span className="stat-value-large">{info.GPUMemoryTotal}</span><span className="stat-value-sub">МБ</span><span className="stat-value-sub-muted">({((info.GPUMemoryTotal||0)/1024).toFixed(1)} ГБ)</span></div></div>
                    </div>
                </div>

                <div className="section-box glass-card">
                    <div className="section-title"><IconRam s={16} />Оперативная память<span className="chip">RAM</span></div>
                    <div className="stat-group">
                        <div className="stat-item">
                            <div className="stat-value-group-horizontal">
                                <span className="stat-value-large">{Math.round(info.RAMUsed/1024)}</span><span className="stat-value-sub">ГБ</span>
                                <span className="stat-divider">/</span>
                                <span className="stat-value-large">{Math.round(info.RAMTotal/1024)}</span><span className="stat-value-sub">ГБ</span>
                                <span className="stat-value-sub-muted">({ramPercent}%)</span>
                            </div>
                        </div>
                        <div className="stat-item"><div className="progress-wrapper"><div className="progress-label"><span>{ramPercent}%</span></div><StatBar value={info.RAMUsed} max={info.RAMTotal} color="var(--accent2)" /></div></div>
                    </div>
                </div>

                <div className="section-box glass-card">
                    <div className="section-title"><IconDisk s={16} />Диск (C:)<span className="chip">SSD/HDD</span></div>
                    <div className="stat-group">
                        <div className="stat-item"><div className="stat-value-group-horizontal"><span className="stat-value-large">{info.DiskFreeGB}</span><span className="stat-value-sub">ГБ свободно</span></div></div>
                        <div className="stat-item"><div className="progress-wrapper"><div className="progress-label"><span>{diskPercent}%</span></div><StatBar value={info.DiskTotalGB - info.DiskFreeGB} max={info.DiskTotalGB} color="var(--accent3)" /></div></div>
                        <div className="stat-item"><div className="stat-value-group"><span className="stat-value-sub">Всего: </span><span className="stat-value">{info.DiskTotalGB} ГБ</span></div></div>
                    </div>
                </div>

                <div className="section-box glass-card full-width">
                    <div className="section-title"><IconWin s={16} />Система Windows<span className="chip">OS</span></div>
                    <div className="stat-grid-3">
                        <div className="stat-item"><span className="stat-label">Версия</span><div className="stat-value-group"><span className="stat-value">{info.WinVersion?.split(' ').slice(0,3).join(' ') || '—'}</span></div></div>
                        <div className="stat-item"><span className="stat-label">Компьютер</span><div className="stat-value-group"><span className="stat-value hostname">{info.Hostname || '—'}</span></div></div>
                        <div className="stat-item"><span className="stat-label">Uptime</span><div className="stat-value-group"><span className="stat-value uptime">{info.Uptime || '—'}</span><span className="stat-value-sub-muted">без перезагрузки</span></div></div>
                    </div>
                </div>
            </div>

            <div className="info-box system-footer">
                <div className="info-row"><span>Архитектура: x64</span><span>Обновляется в реальном времени</span></div>
            </div>
        </div>
    );
}

// ─── Sidebar & App root ─────────────────────
const SIDEBAR = [
    { label: 'Главная',     Icon: IconHome },
    { label: 'Оптимизация', Icon: IconOpt  },
    { label: 'DNS',         Icon: IconDns  },
    { label: 'Параметры',   Icon: IconCog  },
];

export default function App() {
    const [active, setActive]     = useState('Главная');
    const [info, setInfo]         = useState(null);
    const [username, setUsername] = useState('');
    const mainRef                 = useRef(null);

    useEffect(() => {
        (async () => {
            try { const n = await GetWindowsUser(); setUsername(n.split('\\').pop() || n); }
            catch { setUsername('User'); }
        })();
    }, []);

    useEffect(() => {
        const load = async () => { try { setInfo(await GetSystemInfo()); } catch {} };
        load();
        const t = setInterval(load, 2000);
        return () => clearInterval(t);
    }, []);

    const avatarLetter = username ? username[0].toUpperCase() : 'U';

    return (
        <div className="App">
            <div className="sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <img src={samlinkLogo} alt="" className="sidebar-logo-image" />
                    </div>
                    <div className="sidebar-brand-text">Samlink</div>
                </div>

                {SIDEBAR.map(({ label, Icon }) => (
                    <div key={label} className={`sidebar-item ${active === label ? 'active' : ''}`} onClick={() => setActive(label)}>
                        <Icon /> {label}
                    </div>
                ))}

                <div className="sidebar-footer">
                    <div className="sidebar-social">
                        <a href="https://discord.gg/kYdtusFvk" title="Discord">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19.2 19.2 0 0015.9 3c-.2.4-.4.8-.6 1.2a17.7 17.7 0 00-5.3 0A13 13 0 009.4 3a19.1 19.1 0 00-4.4 1.4A20.3 20.3 0 002 18.5a19.3 19.3 0 005.9 3 14.4 14.4 0 001.2-2l-1.9-.7.4-1 2 .7a14 14 0 007.8 0l2-.7.4 1-1.9.7a14.4 14.4 0 001.2 2 19.2 19.2 0 005.9-3A20.2 20.2 0 0020.3 4.4zM8.7 15.5c-1.1 0-2-1.1-2-2.4s.9-2.4 2-2.4 2 1 2 2.4-.9 2.4-2 2.4zm6.6 0c-1.1 0-2-1.1-2-2.4s.9-2.4 2-2.4 2 1 2 2.4-.9 2.4-2 2.4z"/></svg>
                        </a>
                        <a href="#" title="Telegram">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.9 8.2l-2 9.5c-.2.7-.6.9-1.2.6l-3.3-2.4-1.6 1.5c-.2.2-.4.3-.7.3l.2-3.4 5.5-5c.2-.2 0-.3-.3-.1L6.4 14.3 3.2 13.3c-.7-.2-.7-.7.2-1l11.6-4.5c.6-.2 1.1.1.9 1z"/></svg>
                        </a>
                        <a href="#" title="YouTube">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-.3C16.8 3.7 12 3.7 12 3.7s-4.8 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 6 1 8 1 8S.7 10.3.7 12.5v2.1C.7 16.8 1 19 1 19s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.6 23.2 12 23.2 12 23.2s4.8 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8S23.3 16.8 23.3 14.6v-2.1C23.3 10.3 23 8 23 7zm-14 8.5V8.5l6.5 3.5-6.5 3.5z"/></svg>
                        </a>
                    </div>
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">{avatarLetter}</div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{username || '...'}</span>
                            <span className="sidebar-user-tier">Free</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mainbar" ref={mainRef}>
                {active === 'Главная'     && <Dashboard info={info} />}
                {active === 'Оптимизация' && <OptimizationTab />}
                {active === 'DNS'         && <DnsTab />}
                {active === 'Параметры'   && <SettingsTab />}
            </div>
        </div>
    );
}