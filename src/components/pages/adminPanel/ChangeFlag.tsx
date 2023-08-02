type flagProps = {
    changes: boolean
}


function ChangeFlag({ changes }: flagProps) {
    return (
        <div className={`changeFlag ${changes ? "active" : ""}`}>
            <i className="fa-solid fa-pen-to-square" />
        </div>
    )
}

export default ChangeFlag