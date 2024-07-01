'use client'
export interface AlertProps {
    message: string
}
export function Alert(props: AlertProps) {
    alert(props.message)
    window.location.replace('/admin/docentes/new')
    return null
}