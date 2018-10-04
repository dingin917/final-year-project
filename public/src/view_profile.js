var ViewProfile = React.createClass({

    getInitialState: function(){
      return({
        prof: {courses:[]}
      });
    },

    render: function(){
      var prof = this.state.prof;
      var courses = prof.courses;

      return(
        <div id="course-container">
          <form id="search" onSubmit={this.handleSubmit}>
            <label>Enter a teaching staff name </label>
            <input type="text" ref="name" placeholder="e.g.SP" required />
            <input type="submit" value="Find Schedule" />
          </form>
          <div>
            {prof.name}
          </div>
          <ul>
            {
              courses.map(course =>
                <li key={course._id}>
                  <span className="code">Code: {course.code} </span>
                  <span className="title">Code: {course.title} </span>
                  <span className="type">Type: {course.type} </span>
                  <span className="index">Index: {course.index} </span>
                  <span className="group">Group: {course.group} </span>
                  <span className="teachingweek">Week: {course.teachingweek.map(function(week){
                      return <span>{week} </span>
                  })} </span>
                  <span className="day">Time: {course.day} </span>
                  <span className="time">{course.time} </span>
                  <span className="venue">Venue: {course.venue} </span>
                </li>)
            }
          </ul>
        </div>
      );
    },

    handleSubmit: function(event){
      event.preventDefault();
      var name = this.refs.name.value;

      fetch('/api/teachers?name=' + name).then(function(data){
        return data.json();
      }).then(json => {
        this.setState({
          prof: json 
        });
      });
    }
  });

ReactDOM.render(<ViewProfile />, document.getElementById('viewprofile'));