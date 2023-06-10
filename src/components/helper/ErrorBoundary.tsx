import { Component, ErrorInfo } from 'react'

type errorBoundaryProps = {
    children: any,
    fallback?: any
}


export class ErrorBoundary extends Component<errorBoundaryProps> {
    state = { hasError: false }

    static getDerivedStateFromError(error: any) {
        return {hasError: true}
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error(error, errorInfo.componentStack)
    }



    render() {
        if(this.state.hasError){
            this.props.fallback ??
            <div className="mildWarn">Error!</div>
        }
        return this.props.children
    }
}

export default ErrorBoundary