import 'package:taskflow_mobile/domain/repositories/task_repository.dart';

class GetStatusStatsUseCase {
  final TaskRepository repository;

  GetStatusStatsUseCase(this.repository);

  Future<Map<String, int>> call({String period = 'all'}) async {
    return repository.getStatusStats(period: period);
  }
}
