import {Link} from 'react-router-dom'

type cardProps = {
    path: string
    type: string
    label: string
    src: string
    text: any
}

function CardItem(props: cardProps) {
  return (
    <>
        <li className='cards__item'>
            <Link className='cards__item__link' to={props.path}>
                <figure className={`cards__item__pic-wrap ${props.type}`} data-category={props.label}>
                    <img src={props.src} alt='image' className='cards__item__img'></img>
                </figure>
                <div className='cards__item__info'>
                    <h5 className='cards__item__text'>{props.text}</h5>
                </div>
            </Link>
        </li>
    </>
  )
}

export default CardItem