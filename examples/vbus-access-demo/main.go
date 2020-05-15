package main

import (
	"bitbucket.org/vbus/vbus.go"
	"github.com/sirupsen/logrus"
	"time"
)

func main() {
	client := vBus.NewClient("system", "info", vBus.WithStaticPath("./ui/build"))
	if err := client.Connect(); err != nil {
		logrus.Fatal(err)
	}
	defer func() {
		if err := client.Close(); err != nil {
			logrus.Error(err)	
		}
	}()

	_, err := client.AddNode("status", vBus.RawNode{
		"hour": vBus.A("hour", time.Now().Format("15:04:05"), vBus.OnGet(func(data interface{}, segment []string) interface{} {
			return time.Now().Format("15:04:05")
		})),
	})
	if err != nil {
		logrus.Error(err)
	}

	select{}
}
