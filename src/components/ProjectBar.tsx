import React, {useEffect, useState} from 'react'
import './ProjectBar.css'

type barProps = {
  children: any
  type: string
  scroll: number
}

function ProjectBar(props: barProps) {
  useEffect(() => {
      if(props.scroll>50){
        document.getElementById('bar')?.classList.add('zero-height');
        document.getElementById('bar_item_container')?.classList.add('zero-height');
      } else{
        document.getElementById('bar')?.classList.remove('zero-height');
        document.getElementById('bar_item_container')?.classList.remove('zero-height');
      }
  }, [props.scroll])

  return (
    <div id='bar' className={`project-bar ${props.type}`}>
        <div id='bar_item_container' className='item-container'>
            {props.children}
        </div>
    </div>
  )
}

export default ProjectBar