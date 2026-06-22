package pkg

import (
	"fmt"
	"os"

	"github.com/evanw/esbuild/pkg/api"
)

func BundleTypescript() {
	result := api.Build(api.BuildOptions{
		EntryPoints:       []string{"cmd/web/ts/app.ts"},
		Bundle:            true,
		Outfile:           "cmd/web/assets/js/app.js",
		Write:             true,
		MinifyWhitespace:  true,
		MinifyIdentifiers: true,
		MinifySyntax:      true,
		Target:            api.ES2017,
		LogLevel:          api.LogLevelInfo,
	})

	if len(result.Errors) > 0 {
		for _, e := range result.Errors {
			fmt.Fprintln(os.Stderr, e.Text)
		}
		os.Exit(1)
	}
}
