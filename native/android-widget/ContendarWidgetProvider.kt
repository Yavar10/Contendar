package com.contendar.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ContendarWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        val prefs = context.getSharedPreferences("group.com.contendar.app", Context.MODE_PRIVATE)
        val jsonStr = prefs.getString("contendar_widget_data", null)

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_small)

            if (jsonStr != null) {
                try {
                    val root = JSONObject(jsonStr)
                    val liveObj = root.optJSONObject("activeLiveRound")
                    val nextObj = root.optJSONObject("nextUpcomingRound")
                    val contest = liveObj ?: nextObj

                    if (contest != null) {
                        val isLive = liveObj != null
                        val title = contest.getString("title")
                        val platform = contest.getString("platformName")
                        val startMs = contest.getLong("startTimeMs")

                        views.setTextViewText(R.id.widget_status, if (isLive) "LIVE NOW" else "UP NEXT")
                        views.setTextColor(R.id.widget_status, if (isLive) 0xFFFF453A.toInt() else 0xFF0A84FF.toInt())
                        views.setTextViewText(R.id.widget_title, title)
                        views.setTextViewText(R.id.widget_platform, platform)

                        val timeFormat = SimpleDateFormat("h:mm a", Locale.getDefault())
                        views.setTextViewText(R.id.widget_time, timeFormat.format(Date(startMs)))

                        // Deep link intent
                        val contestId = contest.getString("id")
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("contendar://contest/$contestId"))
                        val pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
                        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)
                    } else {
                        views.setTextViewText(R.id.widget_status, "RADAR ACTIVE")
                        views.setTextViewText(R.id.widget_title, "No Upcoming Rounds")
                        views.setTextViewText(R.id.widget_platform, "Codeforces · LeetCode · CodeChef")
                    }
                } catch (e: Exception) {
                    views.setTextViewText(R.id.widget_title, "Contendar Radar")
                }
            } else {
                views.setTextViewText(R.id.widget_title, "Contendar Radar")
                views.setTextViewText(R.id.widget_status, "Open App to Sync")
            }

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}

