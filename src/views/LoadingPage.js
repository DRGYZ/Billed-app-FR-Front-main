import VerticalLayout from './VerticalLayout.js'

export default () => {

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content' id='loading'>
        Loading...
      </div>
    </div>`
  )
}
