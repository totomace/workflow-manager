import { ConfirmDialog } from '../ui';
import type { DeleteConfirmModalProps } from '../../types/dashboard';

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteConfirmModalProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa task"
      message="Bạn có chắc chắn muốn xóa task này? Hành động này không thể hoàn tác."
      confirmText="Xóa"
      variant="danger"
      isLoading={isPending}
    />
  );
}