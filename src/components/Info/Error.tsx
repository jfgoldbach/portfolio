import React from 'react'
import Button from '../Button'

type errorProps = {
    error: {
        message?: string,
        code?: string
    },
    reload?: () => void
}

function Error({ error, reload }: errorProps) {
    return (
        <div className="info-container mildWarn fetchError scaleIn">
            <i className="fa-solid fa-triangle-exclamation" />
            <p>{`${error?.message} (code: ${error?.code})`}</p>
            {reload &&
                <Button onClick={reload}>
                    <i className="fa-solid fa-arrows-rotate"></i>
                </Button>
            }
        </div>
    )
}

export default Error