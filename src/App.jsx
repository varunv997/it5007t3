const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

class ReservationRow extends React.Component {
  constructor() {
    super();
  }

  render() {
    const reservation = this.props.reservation;
    const idx = this.props.idx
    return (
      <tr>
        <td>{idx}</td>
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

class BlacklistRow extends React.Component {
  constructor() {
    super();
  }

  render() {
    const blacklist = this.props.blacklist;
    const idx = this.props.idx;
    return (
      <tr>
        <td>{idx}</td>
        <td>{blacklist.name}</td>
        <td>{blacklist.phone}</td>
        <td>{blacklist
            .created
            .toDateString()}</td>
      </tr>
    )
  }
}

class ReservationTable extends React.Component {
  render() {
    let idx = 1;
    const reservationRows = this
      .props
      .reservations
      .map(reservation => <ReservationRow key={reservation.id} reservation={reservation} idx={idx++} handleDelete={this.props.handleDelete}/>);

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

class BlacklistTable extends React.Component {
  render() {
    let idx = 1;
    const blacklistRows = this.props.blacklist.map(
      blacklistcustomer => <BlacklistRow key={blacklistcustomer.id} blacklist={blacklistcustomer} idx={idx++} />
    );
    
    return (
      <table className="bordered-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {blacklistRows}
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

class BlacklistList extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.blacklistAdd;
    const blacklistCustomer = {
      name: form.name.value,
      phone: form.phone.value,
    }

    const namere = /^([a-zA-Z ]){2,30}$/
    if (!namere.test(blacklistCustomer.name)) {
      alert("Please enter a valid name (at least 2 characters long without numbers)");
      return;
    }

    const phonere = /^\d{8}$/;    ;
    if (!phonere.test(blacklistCustomer.phone)) {
      alert("Please Enter a valid 8 digit phone number)");
      return;
    }

    this
      .props
      .createBlacklist(blacklistCustomer);
    form.name.value = "";
    form.phone.value = "";
  }

  render() {
    return (
      <React.Fragment>
        <h1>Blacklisted Customers</h1>
        <hr/>
        <BlacklistTable blacklist={this.props.blacklist} />
        <hr/>
        <form name="blacklistAdd" onSubmit={this.handleSubmit}>
          <input type="text" name="name" placeholder="Name"/>
          <input type="text" name="phone" placeholder="Phone"/>
          <button>Add</button>
        </form>
      </React.Fragment>
    )
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
      showBlackListedCustomers:false,
      reservations: [],
      blacklist: []
    };
    this.activateComponent = this.activateComponent.bind(this);
    this.createReservation = this.createReservation.bind(this);
    this.createBlacklist = this.createBlacklist.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadReservationData() {
    const query = `query {
      reservationList {
        id
        name
        phone
        created
      }
    }`;

    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {query} )
    });

    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);
    console.log(result.data.reservationList)
    return result.data.reservationList
  }

  async loadBlacklistData() {
    const query = `query {
      blacklist {
        id
        name
        phone
        created
      }
    }`;

    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {query} )
    });

    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);
    console.log(result.data.blacklist)
    return result.data.blacklist
  }

  async loadData() {
    this.setState( {reservations: await this.loadReservationData(), blacklist: await this.loadBlacklistData()} )
  }

  activateComponent(component) {
    switch(component) {
      case "showCreateReservation":
        this.setState({ showCreateReservation: true, showReservationList: false, showDeleteReservation: false, showHome: false, showBlackListedCustomers: false });
        break;
      case "showReservationList":
        this.setState({ showReservationList: true, showCreateReservation: false, showDeleteReservation: false, showHome: false, showBlackListedCustomers: false });
        break;
      case "showDeleteReservation":
        this.setState({ showDeleteReservation: true, showCreateReservation: false, showHome: false, showReservationList: false, showBlackListedCustomers: false });
        break;
      case "showHome":
        this.setState({ showHome: true, showCreateReservation: false, showDeleteReservation: false, showReservationList: false, showBlackListedCustomers: false });
        break;
      case "showBlackListedCustomers":
        this.setState({ showBlackListedCustomers: true, showHome: false, showCreateReservation: false, showDeleteReservation: false, showReservationList: false })
      default:
        null;
    }
  }

  async createReservation(reservation) {
    reservation.id = Date.now().toString();
    reservation.created = new Date();
    const newReservationList = this
      .state
      .reservations
      .slice();
    if (newReservationList.length <=24) {
      const query = `mutation {
        createReservation( reservation: {
          id: "${reservation.id}",
          name: "${reservation.name}",
          phone: "${reservation.phone}",
          created: "${reservation.created}"
        }) {
          id,
          name,
          phone,
          created,
        }
      }`;

      const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables: { reservation } })
      });

      this.loadData()
    }
    else {
      alert("Overflow");
    }
  }

  async createBlacklist(customer) {
    customer.id = Date.now().toString();
    customer.created = new Date();

    const query = `mutation {
      createBlacklist( customer: {
        id: "${customer.id}",
        phone: "${customer.phone}",
        name: "${customer.name}",
        created: "${customer.created}"
      }) {
        id,
        name,
        phone,
        created,
      }
    }`;

    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables: { customer } })
    });

    this.loadData();
  }

  async handleDelete(id) {
    const query = `mutation {
      deleteReservation (id: "${id.toString()}") {
        id,
        name,
        phone,
        created
      }
    }`;

    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables: { id } })
    });

    this.loadData()

  }

  render() {
    return (
      <div>
        <div>
          <button  onClick={() => this.activateComponent("showHome")}>Home</button>
          <button  onClick={() => this.activateComponent("showCreateReservation")}>Create Reservation</button>
          <button  onClick={() => this.activateComponent("showDeleteReservation")}>Delete Reservation</button>
          <button  onClick={() => this.activateComponent("showReservationList")}>View Reservations</button>
          <button  onClick={() => this.activateComponent("showBlackListedCustomers")}>Blacklist Customer</button>
        </div>
        {this.state.showHome && <Home rows={5} cols={5} totalBookings={this.state.reservations.length} />}
        {this.state.showReservationList && <ReservationList reservations={this.state.reservations}/>}
        {this.state.showCreateReservation && <ReservationAdd createReservation={this.createReservation} />}
        {this.state.showDeleteReservation && <ReservationList reservations={this.state.reservations} handleDelete={this.handleDelete}/>}
        {this.state.showBlackListedCustomers && <BlacklistList blacklist={this.state.blacklist} createBlacklist={this.createBlacklist}></BlacklistList>}
      </div>
    )
  }
}

const app = <ReservationsApp />
ReactDOM.render(app, document.getElementById('contents'));