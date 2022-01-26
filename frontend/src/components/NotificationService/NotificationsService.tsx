import React, {Component} from "react";
import "./NotificationsService.scss";

export class NotificationsService {
  private static displays: NotificationsDisplay | null;

  /**
   * Push a notification. keepAlive is optional (defaults to 5000ms)
   * @param type
   * @param message
   * @param keepAlive
   */
  static push(type: NotificationType, message: string, keepAlive?: number) {
    if (NotificationsService.displays !== null) {
      NotificationsService.displays.push(type, message, keepAlive);
    }
  }

  static register(instance: NotificationsDisplay) {
    this.displays = instance;
  }

  static unregister() {
    this.displays = null;
  }
}

type NotificationType = 'info' | 'success' | 'warning' | 'error';

export class Notification {
  private static nextId = 0;

  id: number;

  type: NotificationType;

  message: string;

  constructor(type: NotificationType, message: string) {
    this.id = Notification.nextId;
    this.type = type;
    this.message = message;

    Notification.nextId += 1;
  }
}

interface IProps {}

interface IState {
  notifications: Notification[];
}

export class NotificationsDisplay extends Component<IProps, IState> {
  private static readonly keepNotificationAlive = 5000;

  constructor(props: IProps) {
    super(props);

    NotificationsService.register(this);
    this.state = { notifications: [] };
  }

  componentWillUnmount() {
    NotificationsService.unregister();
  }

  push(type: NotificationType, message: string, keepAlive: number = NotificationsDisplay.keepNotificationAlive) {
    const notification = new Notification(type, message);
    const { id } = notification;

    // Add notification
    this.setState((state) => ({ ...state, notifications: [...state.notifications, notification] }));

    setTimeout(() => {
      // Remove Notification
      this.setState((state) => ({ ...state, notifications: [...state.notifications.filter((n) => n.id !== id)] }));
    }, keepAlive);
  }

  render() {
    const { notifications } = this.state;
    return (
      <div className={'NotificationsService'}>
        {notifications.map((n) => {
          const iconCode = n.type === 'info' ? 'info' : n.type === 'success' ? 'done' : n.type;
          return (
            <div key={n.id} className={`Notification Notification${n.type.charAt(0).toUpperCase() + n.type.slice(1)}`}>
              <span className={'NotificationIcon material-icons'}>{iconCode}</span>
              <span className={'NotificationMessage'}>{n.message}</span>
            </div>
          )
        })}
      </div>
    );
  }
}
