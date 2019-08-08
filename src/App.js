import React from 'react';
import './App.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import firebase from './Firestore';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  formControl: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(2),
    minWidth: 220,
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4),
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      price: null,
      orders: [],
      type: '',
      displayAddBtn: false,
      open: false,
      modalData: '',
      index: null,
      modalName: '',
      modalPrice: '',
      modalType: ''
    }
  }

  // Get the list of orders from the DB on component mount
  componentDidMount() {
    this.getOrders()
  }

  getOrders = () => {
    const db = firebase.firestore();
    const docRef = db.collection('orders');
    docRef.get().then(querySnapshot=> {
      querySnapshot.forEach(doc => {
        this.setState({orders: doc.data()})
    });
  })
  }

  // Store user input on state
  handleNameChange = (e) => {
    this.setState({name:e.target.value})
  }

  handlePriceChange = (e) => {
    this.setState({price:e.target.value})
  }

  handleTypeChange = (e) => {
    this.setState({type:e.target.value})
  }

  // Show / Hide the 'Add Order' form
  toggleAddBtn = () => {
    this.setState({displayAddBtn: !this.state.displayAddBtn})
  }

  handleAddSubmit = () => {
    const obj = {
      name: this.state.name,
      price: this.state.price,
      type: this.state.type
    }
    if (this.state.name === '' || this.state.price === null || this.state.type === '') {
      alert('Please fill in all the fields to continue')  // Very simple form field validation. It can be replaced with something more elegant
    } else {
      const db = firebase.firestore();
      db.collection('orders').doc('6shUXbgWCSH3CcuQ7BPf').update({data:firebase.firestore.FieldValue.arrayUnion(obj
      )})
      this.getOrders()
      this.setState({displayAddBtn:false})
    } 
  }

  handleDelete = (row) => {
    const db = firebase.firestore();
    const obj = {
      name: row.name,
      price: row.price,
      type: row.type
    }
    db.collection('orders').doc('6shUXbgWCSH3CcuQ7BPf').update({data:firebase.firestore.FieldValue.arrayRemove(obj
    )})
    this.getOrders()
  }

  handleEdit = (row,i) => {
    this.setState({open:!this.state.open, modalData:row, modalName:row.name, modalPrice:row.price, modalType: row.type, index: i})
  }

  handleModalClose = () => {
    this.setState({open:false})
  }

  handleUpdate = () => {
    let arr = this.state.orders.data
    arr[this.state.index] = {name:this.state.modalName,price:this.state.modalPrice,type:this.state.modalType}
    this.setState({orders: arr})
    const db = firebase.firestore();
    db.collection("orders").doc("6shUXbgWCSH3CcuQ7BPf").set(this.state.orders)
    .then(()=> {
        console.log("Document successfully written!");
        this.getOrders()
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    this.handleModalClose()
  }

  handleModalName = (e) => {
    this.setState({modalName: e.target.value})
  }

  handleModalPrice = (e) => {
    this.setState({modalPrice: e.target.value})
  }

  handleModalType = (e) => {
    this.setState({modalType: e.target.value})
  }

  render() {
    const { classes } = this.props;
    return(
      <Container maxWidth="lg">
         <Button variant="contained" color="primary" className={classes.button} onClick={this.toggleAddBtn}>
        Add New Order
        <AddIcon className={classes.rightIcon} />
      </Button>
      {this.state.displayAddBtn && 
      <form className={classes.container} noValidate autoComplete="off">
      <TextField
        id="name"
        label="Name"
        className={classes.textField}
        onChange={this.handleNameChange}
        margin="normal"
      />
      <TextField
        id="price"
        label="Max Bid Price"
        className={classes.textField}
        onChange={this.handlePriceChange}
        margin="normal"
      />
       <FormControl className={classes.formControl}>
        <InputLabel htmlFor="type">Data Package Type</InputLabel>
        <Select
          value={this.state.type}
          onChange={this.handleTypeChange}
        >
          <MenuItem value={'Device Location'}>Device Location</MenuItem>
          <MenuItem value={'Device Behavior'}>Device Behavior</MenuItem>
          <MenuItem value={'ID Mapping'}>ID Mapping</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" className={classes.button} onClick={this.handleAddSubmit}>
        Submit
      </Button>
      </form>
      }
      <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Max Bid Price</TableCell>
            <TableCell align="right">Data Package Type</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.orders.data && this.state.orders.data.map((row,i) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">
                <Tooltip title="Delete"><IconButton color="secondary" aria-label="delete" className={classes.margin} onClick={()=>this.handleDelete(row)}>
                  <DeleteIcon />
                </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Update"><IconButton color="primary" aria-label="edit" className={classes.margin} onClick={()=>this.handleEdit(row,i)}>
                  <EditIcon />
                </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
    <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.open}
        style={{top:'25%',left:'35%'}}
      >
        <div className={classes.paper}>
          <h2 id="simple-modal-title">Update order {this.state.modalData.name}</h2>
          <div>
              <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="name"
                label="Name"
                className={classes.textField}
                onChange={this.handleModalName}
                margin="normal"
                defaultValue={this.state.modalData.name}
              />
              <TextField
                id="price"
                label="Max Bid Price"
                className={classes.textField}
                onChange={this.handleModalPrice}
                margin="normal"
                defaultValue={this.state.modalData.price}
              />
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="type">Data Package Type</InputLabel>
                <Select
                  value={this.state.modalData.type}
                  onChange={this.handleModalType}
                >
                  <MenuItem value={'Device Location'}>Device Location</MenuItem>
                  <MenuItem value={'Device Behavior'}>Device Behavior</MenuItem>
                  <MenuItem value={'ID Mapping'}>ID Mapping</MenuItem>
                </Select>
              </FormControl>
              <div style={{marginTop:20}}>
              <Button variant="contained" color="primary" className={classes.button} onClick={this.handleUpdate}>
                Submit
              </Button>
              <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleModalClose}>
                Close
              </Button>
              </div>
          </form>
          </div>
        </div>
      </Modal>
    </Container >
    )
  }
}

export default withStyles(styles)(App);
