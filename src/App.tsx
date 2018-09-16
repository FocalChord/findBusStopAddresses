import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import * as React from 'react';
import './App.css';
import { ListItemText, CircularProgress } from '@material-ui/core';
import { Grid } from '@material-ui/core';

interface IBusCard {
  region: any;
  lat: any;
  long: any;
  errorMessage: any;
  loading: any;
  results: any[];
  error: any;
  name: string;
}

class App extends React.Component<{}, IBusCard> {

  constructor(props: any) {
    super(props);
    this.state = {
      region: "nz-akl",
      lat: "", 
      long: "", 
      errorMessage: "",
      loading: false,
      results: [],
      error: false,
      name: ""
    };
  }

  public getVals = (e : any) => {
    if (this.state.loading) {
      return;
    }

    e.preventDefault();

    if (navigator.geolocation) {
      this.setState({ loading: true });
      navigator.geolocation.getCurrentPosition( (loc) => {
        this.setState({
          lat: loc.coords.latitude.toString(), 
          long: loc.coords.longitude.toString()
        });

        const URL = 'https://waka.app/a/nz-akl/station/search?lat=' + this.state.lat + '&lon=' + this.state.long + '&distance=' + this.state.name;
        fetch(URL)
        .then ((response : any) => {
          if (!response.ok) {
            this.setState({
              loading: false, 
              error: true,
              errorMessage: "Enter a distance between 0 and 1500"
            });
          } else {
            response.json().then((data : any) => {
              const busAdd = []
              for (const d in data) {
                if (data[d] !== false) {
                  busAdd.push(data[d].stop_name);
                }
              }

              if (busAdd.length === 0) {
                this.setState({
                  loading: false,
                  error: true,
                  errorMessage: "Distance is too small, please try with a larger distance"
                });
              } else {
                this.setState({
                  results: busAdd, 
                  loading: false,
                  error: false 
                });
              }
            
            });
          }
        });
      });
    } else {
      this.setState({ 
        loading: false, 
        error: true,
        errorMessage: "Please ensure that your browser has access to your location"
      });
    }
  }

  public setName = ( e : React.ChangeEvent<HTMLInputElement> ) => {
    this.setState({ name : e.target.value });
  }



  public render() {

    const results = this.state.error ? <ListItem> {this.state.errorMessage} </ListItem> : this.state.results.map((result,index) => 
    <ListItem key={index}>
      <ListItemText>
      {index+1}: {result}
      </ListItemText>
    </ListItem>
    );
  

    const whatToDisp = this.state.loading ? <CircularProgress /> : <List> {results} </List>
    

    return (
          <div className="App">

          <header className="App-header">
            <h1 className="App-title">Find addresses of bus stops close to you! </h1>
            <h4> <i> Currently only working in Auckland  </i></h4>
          </header>

          <div className="input">
            <Input placeholder="Please enter a search distance (i.e. '1000')" style={{width: "310px"}} value={this.state.name} onChange={this.setName}  />
          </div>

          <div className="buttonDiv"> <Button onClick={this.getVals} variant="contained"> Find </Button> </div>

          <div className="load">
            <Grid container={true} justify="center">
              {whatToDisp}
            </Grid>
          </div>
          </div>      
    );
  }
}


export default App;
