const Header = (props) => {
    return (
      <>
        <h2>{props.course.name}</h2>
      </>
    )
  } 
  
  const Content = (props) =>  {
    return (
      <>
      {props.course.parts.map(course => 
        <Part key={course.id} part={course.name} exercises={course.exercises}/>
      )}
      <Total course={props.course}/>
      </>
    )
  }
  
  const Part = (props) => {
    return (
      <>
       <p>
          {props.part} {props.exercises}
       </p>
      </>
    )
  }
  
  const Total = (props) => {
    const sum = props.course.parts.reduce( (s, p) => s + p.exercises, 0)
    return(
      <>
        <p><b>Number of exercises {sum}</b></p>
      </>
    )
  }
  

const Course = (props) => {
    return(
    <>
        <h1>Web development curriculum</h1>
        {props.courses.map(c => 
            <div key={c.id}>
                <Header course={c} />
                <Content course={c} />
            </div>
        )}
    </>
    )
}

export default Course