export interface CustomDialog {
    header: string;
    content: string;
    type: "warning" | "success" | "error";
    buttons: DialogButton[]
}

export interface DialogButton {
    name: string;
    color?: "primary" | "warn" | "accent";
    action?: string;
}