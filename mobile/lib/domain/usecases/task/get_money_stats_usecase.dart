import 'package:taskflow_mobile/domain/repositories/task_repository.dart';

class GetMoneyStatsUseCase {
  final TaskRepository repository;

  GetMoneyStatsUseCase(this.repository);

  Future<double> call({String period = 'all'}) async {
    return repository.getMoneyStats(period: period);
  }
}
