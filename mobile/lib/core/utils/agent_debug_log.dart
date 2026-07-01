import 'dart:convert';
import 'dart:io' show Platform;

import 'package:flutter/foundation.dart' show debugPrint, kIsWeb;
import 'package:http/http.dart' as http;

void agentDebugLog({
  required String location,
  required String message,
  required Map<String, dynamic> data,
  String? hypothesisId,
  String runId = 'pre-fix',
}) {
  // #region agent log
  final host = (!kIsWeb && Platform.isAndroid) ? '10.0.2.2' : '127.0.0.1';
  final payload = jsonEncode({
    'sessionId': '65ed9f',
    'runId': runId,
    if (hypothesisId != null) 'hypothesisId': hypothesisId,
    'location': location,
    'message': message,
    'data': data,
    'timestamp': DateTime.now().millisecondsSinceEpoch,
  });
  http
      .post(
        Uri.parse(
          'http://$host:7653/ingest/28e53928-3d86-4201-9c7c-97ca29d9352a',
        ),
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '65ed9f',
        },
        body: payload,
      )
      .catchError((_) => http.Response('', 500));
  debugPrint('[agent-debug] $payload');
  // #endregion
}
