import { useCallback } from "react";
import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = useCallback(
    (desc: string, type: NotificationType) => {
      api[type]({
        message: `Notification`,
        description: desc,
        placement: "top",
      });
    },
    [api]
  );

  return { openNotification, contextHolder };
};

export default useNotification;
