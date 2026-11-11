package com.contendar.widgetbridge

import android.content.Intent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WidgetBridgeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WidgetBridge")

    Function("reloadAllTimelines") {
      val context = appContext.reactContext ?: return@Function
      val intent = Intent("android.appwidget.action.APPWIDGET_UPDATE")
      context.sendBroadcast(intent)
    }
  }
}

