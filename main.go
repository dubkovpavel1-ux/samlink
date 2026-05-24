package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "Samlink System Optimizer",
		Width:            1280,
		Height:           1080,
		WindowStartState: options.Maximised, // Изменено с Maximised на Fullscreen
		DisableResize:    false,             // Изменено с true на false - разрешаем изменение размера
		Windows: &windows.Options{
			DisableWindowIcon:    false,
			IsZoomControlEnabled: true, // Включаем кнопки управления окном
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 15, G: 15, B: 23, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
