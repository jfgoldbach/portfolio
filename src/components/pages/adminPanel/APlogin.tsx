import Button from "../../Button";

export default function APlogin() {
    return (
        <div className="AP-main-container">
            <section>
                <h2>Change login details</h2>
                <div className="twoPure-content">
                    <label className="credentials">
                        New Username
                        <input autoComplete="false" type="text" placeholder="Username" />
                    </label>
                    <label className="credentials">
                        New Password
                        <input autoComplete="false" type="text" placeholder="Password" />
                        <input autoComplete="false" type="text" placeholder="Confirm password" />
                    </label>
                </div>
                <Button>Change</Button>

            </section>
        </div>
    )
}