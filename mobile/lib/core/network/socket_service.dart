import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:taskflow_mobile/core/constants/app_constants.dart';
import 'package:taskflow_mobile/core/utils/agent_debug_log.dart';
import 'package:taskflow_mobile/data/models/task_model.dart';
import 'package:taskflow_mobile/presentation/providers/task_provider.dart';

class SocketService {
  IO.Socket? _socket;
  TaskProvider? _taskProvider;
  bool _listenersAttached = false;

  bool get isConnected => _socket?.connected ?? false;

  void connect(TaskProvider taskProvider) {
    // Luôn cập nhật _taskProvider trước, ngay cả khi socket đã connected.
    // Bug cũ: return sớm mà không update provider → socket nhận event nhưng
    // gọi vào provider cũ/null → UI không tự cập nhật.
    _taskProvider = taskProvider;

    if (_socket?.connected == true) {
      // #region agent log
      agentDebugLog(
        location: 'socket_service.dart:connect',
        message: 'socket already connected, taskProvider reference updated',
        hypothesisId: 'F',
        data: {'socketId': _socket?.id},
      );
      // #endregion
      return;
    }

    // #region agent log
    agentDebugLog(
      location: 'socket_service.dart:connect',
      message: 'initiating socket connection',
      hypothesisId: 'F,G',
      data: {
        'socketUrl': AppConstants.socketUrl,
        'listenersAttached': _listenersAttached,
      },
    );
    // #endregion

    _socket?.dispose();
    _listenersAttached = false;

    _socket = IO.io(
      AppConstants.socketUrl,
      IO.OptionBuilder()
          // Ưu tiên websocket trước để có realtime thực sự;
          // polling chỉ fallback khi websocket không dùng được.
          .setTransports(['websocket', 'polling'])
          .disableAutoConnect()
          .enableReconnection()
          .setReconnectionAttempts(5)
          .setReconnectionDelay(2000)
          .build(),
    );

    _attachListeners();
    _socket!.connect();
  }

  void _attachListeners() {
    if (_socket == null || _listenersAttached) return;
    _listenersAttached = true;

    _socket!.onConnect((_) {
      // #region agent log
      agentDebugLog(
        location: 'socket_service.dart:onConnect',
        message: 'socket connected',
        hypothesisId: 'F,G',
        runId: 'post-fix',
        data: {'socketId': _socket?.id},
      );
      // #endregion
    });

    _socket!.onDisconnect((_) {
      // #region agent log
      agentDebugLog(
        location: 'socket_service.dart:onDisconnect',
        message: 'socket disconnected',
        hypothesisId: 'F',
        runId: 'post-fix',
        data: {},
      );
      // #endregion
    });

    _socket!.onConnectError((err) {
      // #region agent log
      agentDebugLog(
        location: 'socket_service.dart:onConnectError',
        message: 'socket connection error',
        hypothesisId: 'G,I',
        runId: 'post-fix',
        data: {'error': err.toString()},
      );
      // #endregion
    });

    _socket!.on('task:created', (data) {
      // #region agent log
      agentDebugLog(
        location: 'socket_service.dart:task:created',
        message: 'received task:created event',
        hypothesisId: 'H',
        runId: 'post-fix',
        data: {'taskId': _extractTaskId(data)},
      );
      // #endregion
      _handleCreated(data);
    });

    _socket!.on('task:updated', (data) {
      // #region agent log
      agentDebugLog(
        location: 'socket_service.dart:task:updated',
        message: 'received task:updated event',
        hypothesisId: 'H',
        runId: 'post-fix',
        data: {'taskId': _extractTaskId(data)},
      );
      // #endregion
      _handleUpdated(data);
    });

    _socket!.on('task:deleted', (data) {
      // #region agent log
      agentDebugLog(
        location: 'socket_service.dart:task:deleted',
        message: 'received task:deleted event',
        hypothesisId: 'H',
        runId: 'post-fix',
        data: {'taskId': _extractTaskId(data)},
      );
      // #endregion
      _handleDeleted(data);
    });
  }

  void disconnect() {
    // #region agent log
    agentDebugLog(
      location: 'socket_service.dart:disconnect',
      message: 'disconnecting socket',
      hypothesisId: 'F',
      runId: 'post-fix',
      data: {'wasConnected': _socket?.connected ?? false},
    );
    // #endregion
    _socket?.dispose();
    _socket = null;
    _taskProvider = null;
    _listenersAttached = false;
  }

  int? _extractTaskId(dynamic data) {
    if (data is Map) {
      final id = data['id'];
      if (id is int) return id;
      if (id is String) return int.tryParse(id);
    }
    return null;
  }

  void _handleCreated(dynamic data) {
    try {
      final task = TaskModel.fromJson(Map<String, dynamic>.from(data as Map));
      _taskProvider?.applyRemoteCreate(task);
    } catch (e) {
      // #region agent log
      agentDebugLog(
        location: 'socket_service.dart:_handleCreated',
        message: 'failed to apply task:created',
        hypothesisId: 'H',
        runId: 'post-fix',
        data: {'error': e.toString()},
      );
      // #endregion
    }
  }

  void _handleUpdated(dynamic data) {
    try {
      final task = TaskModel.fromJson(Map<String, dynamic>.from(data as Map));
      _taskProvider?.applyRemoteUpdate(task);
    } catch (e) {
      // #region agent log
      agentDebugLog(
        location: 'socket_service.dart:_handleUpdated',
        message: 'failed to apply task:updated',
        hypothesisId: 'H',
        runId: 'post-fix',
        data: {'error': e.toString()},
      );
      // #endregion
    }
  }

  void _handleDeleted(dynamic data) {
    try {
      final map = Map<String, dynamic>.from(data as Map);
      final id = map['id'];
      final taskId = id is int ? id : int.parse(id.toString());
      _taskProvider?.applyRemoteDelete(taskId);
    } catch (e) {
      // #region agent log
      agentDebugLog(
        location: 'socket_service.dart:_handleDeleted',
        message: 'failed to apply task:deleted',
        hypothesisId: 'H',
        runId: 'post-fix',
        data: {'error': e.toString()},
      );
      // #endregion
    }
  }
}
