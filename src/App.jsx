const initialReservations = [];

class ReservationRow extends React.Component {
  constructor() {
    super();
  }

  render() {
    const reservation = this.props.reservation;
    return (
      <tr>
        <td>{reservation.id}</td>
        <td>{reservation.name}</td>
        <td>{reservation.phone}</td>
        <td>{reservation
            .created
            .toDateString()}</td>
        {this.props.handleDelete && <td><a href = "#" onClick={() => this.props.handleDelete(reservation.id)}>delete</a></td>}
      </tr>
    );
  }
}

class ReservationTable extends React.Component {
  render() {
    const reservationRows = this
      .props
      .reservations
      .map(reservation => <ReservationRow key={reservation.id} reservation={reservation} handleDelete={this.props.handleDelete}/>);

    return (
      <table className="bordered-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Created</th>
            {this.props.handleDelete && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {reservationRows}
        </tbody>
      </table>
    );
  }
}

class ReservationAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.reservationAdd;
    const reservation = {
      name: form.name.value,
      phone: form.phone.value,
      status: 'New'
    }

    const namere = /^([a-zA-Z ]){2,30}$/
    if (!namere.test(reservation.name)) {
      alert("Please enter a valid name (at least 2 characters long without numbers)");
      return;
    }

    const phonere = /^\d{8}$/;    ;
    if (!phonere.test(reservation.phone)) {
      alert("Please Enter a valid 8 digit phone number)");
      return;
    }

    this
      .props
      .createReservation(reservation);
    form.name.value = "";
    form.phone.value = "";
  }

  render() {
    return (
      <div>
        <h1>Create Reservation</h1>
        <hr />
        <form name="reservationAdd" onSubmit={this.handleSubmit}>
          <input type="text" name="name" placeholder="Name"/>
          <input type="text" name="phone" placeholder="Phone"/>
          <button>Add</button>
        </form>
      </div>
    );
  }
}

class ReservationList extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <React.Fragment>
        {this.props.handleDelete ? <h1>Delete Reservation</h1> : <h1>Reservations</h1>}
        <hr/>
        <ReservationTable reservations={this.props.reservations} handleDelete={this.props.handleDelete}/>
      </React.Fragment>
    );
  }
}

class SeatGrid extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <>
      <h2>Free Seats</h2>
      <table>
        <tbody>
          {
            this.props.seatmap.map((rows, rowidx) =>
              <tr key={rowidx}>
                {
                  rows.map((row, colidx)=>
                    <td className={row == 1? 'occupied':'unoccupied'} key={colidx}></td>
                  )
                }
              </tr>
            )
          }
        </tbody>
      </table>
      <br/>
      <h4>Legend</h4>
      <table>
        <tbody>
          <tr>
            <td className="legend"><div className={'occupied'} /></td>
            <td className="legend"><div>Occupied</div></td>
          </tr>
          <tr>
            <td className="legend"><div className={'unoccupied'} /></td>
            <td className="legend"><div>Free</div></td>
          </tr>
        </tbody>
      </table>
      </>
    )
  }
}

class Home extends React.Component {
  constructor() {
    super();
    this.generateSeatmap = this.generateSeatmap.bind(self.generateSeatmap);
  }

  generateSeatmap(rows, cols, totalBookings) {
    let seatmap = []
    for (let i = 0; i<rows; i++) {
      let row = []
      for (let j=0; j<cols; j++) {
        totalBookings > 0 ? row.push(1) : row.push(0);
        totalBookings -= 1;
      }
      seatmap.push(row);
    }
    return seatmap;
  }

  render() {
    const seatmap = this.generateSeatmap(this.props.rows, this.props.cols, this.props.totalBookings);
    return (
      <div>
        <h1>Welcome to Reservation System</h1>
        <hr/>
        <SeatGrid seatmap={seatmap} />
      </div>
    )
  }
}

class ReservationsApp extends React.Component {
  constructor() {
    super();
    this.state = {
      name:"ReservationsApp",
      showCreateReservation:false,
      showReservationList:false,
      showHome: true,
      showDeleteReservation:false,
      reservations: []
    };
    this.activateComponent = this.activateComponent.bind(this);
    this.createReservation = this.createReservation.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  activateComponent(component) {
    switch(component) {
      case "showCreateReservation":
        this.setState({ showCreateReservation: true, showReservationList: false, showDeleteReservation: false, showHome: false });
        break;
      case "showReservationList":
        this.setState({ showReservationList: true, showCreateReservation: false, showDeleteReservation: false, showHome: false });
        break;
      case "showDeleteReservation":
        this.setState({ showDeleteReservation: true, showCreateReservation: false, showHome: false, showReservationList: false });
        break;
      case "showHome":
        this.setState({ showHome: true, showCreateReservation: false, showDeleteReservation: false, showReservationList: false });
        break;
      default:
        null;
    }
  }

  createReservation(reservation) {
    reservation.id = this.state.reservations.length + 1;
    reservation.created = new Date();
    const newReservationList = this
      .state
      .reservations
      .slice();
    if (newReservationList.length <=24) {
      newReservationList.push(reservation);
      this.setState({reservations: newReservationList});
    }
    else {
      alert("Overflow");
    }
  }

  handleDelete(id) {
    const newReservationList = this
      .state
      .reservations
      .slice()
    
    newReservationList.splice(id-1, 1);
    // handle indices
    let nid = 1
    for (let reservation of newReservationList) {
      reservation.id = nid;
      nid += 1;
    }
    this.setState({reservations: newReservationList});
  }

  render() {
    return (
      <div>
        <div>
          <button  onClick={() => this.activateComponent("showHome")}>Home</button>
          <button  onClick={() => this.activateComponent("showCreateReservation")}>Create Reservation</button>
          <button  onClick={() => this.activateComponent("showDeleteReservation")}>Delete Reservation</button>
          <button  onClick={() => this.activateComponent("showReservationList")}>View Reservations</button>
        </div>
        {this.state.showHome && <Home rows={5} cols={5} totalBookings={this.state.reservations.length} />}
        {this.state.showReservationList && <ReservationList reservations={this.state.reservations}/>}
        {this.state.showCreateReservation && <ReservationAdd createReservation={this.createReservation} />}
        {this.state.showDeleteReservation && <ReservationList reservations={this.state.reservations} handleDelete={this.handleDelete}/>}
      </div>
    )
  }
}

const app = <ReservationsApp />
ReactDOM.render(app, document.getElementById('contents'));
