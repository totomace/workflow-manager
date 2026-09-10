import { Modal } from '../ui';
import type { DeleteConfirmModalProps } from '../../types/dashboard';

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xóa task"
      message="Bạn có chắc chắn muốn xóa task này? Hành động này không thể hoàn tác."
      onConfirm={onConfirm}
      confirmText="Xóa"
      variant="danger"
      isPending={isPending}
    />
  );
}