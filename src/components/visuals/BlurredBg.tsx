type backgroundProps = {
    adminPanel?: boolean
}


function BlurredBg({ adminPanel }: backgroundProps) {
    return (
        <div className={`blurBackground ${adminPanel? "adminPanel" : ""}`}>
            <div className="object1"></div>
            <div className="object3"></div>
            <div className="object2"></div>
        </div>
    )
}

export default BlurredBg