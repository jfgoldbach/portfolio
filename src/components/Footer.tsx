//import '/styles/css/Footer.css'

type footerProps = {
    setContact: React.Dispatch<React.SetStateAction<boolean>>
    setDaten: React.Dispatch<React.SetStateAction<boolean>>
}


function Footer(props: footerProps) {

    const contactHandler = () => {
        props.setContact(true)
        props.setDaten(false)
    }

    const datenHandler = () => {
        props.setContact(false)
        props.setDaten(true)
    }

  return (
    <div className='footer-container'>
        <small className='website-right'>© 2023 Julian Goldbach</small>
            <div className='social-media-wrap'>
                <button className='contact-btn' onClick={contactHandler}>Impressum</button>
                <button className='contact-btn' onClick={datenHandler}>Datenschutzerklärung</button>
                <div className='social-icons'>
                    <a href="https://github.com/jfgoldbach?tab=repositories" title='Github' target='_blank' aria-label='Github' className='social-icon-link'>
                        <i className="fa-brands fa-github"></i>
                    </a>
                    <a href="https://www.get-in-it.de/profil/ryoWpZV4leZwzHsYG4TbtYBkrlvMMDnL" title='get in IT' target='_blank' aria-label='get-in-it' className='social-icon-link get-in-it'>
                        {"{"}
                        <p>IT</p>
                        {"}"}
                    </a>
                    <a title="LinkedIn" href="https://www.linkedin.com/in/julian-goldbach-8a1050255" target="_blank" className='social-icon-link'>
                        <i className="fa-brands fa-linkedin"></i>
                    </a>
                </div>
            </div>
    </div>
  )
}

export default Footer