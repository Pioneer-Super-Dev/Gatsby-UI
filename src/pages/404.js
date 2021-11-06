import React, { Component } from 'react';
import { Container, Row, Col } from "reactstrap";

import errorImg from "../images/error-img.png";

class NotFoundPage extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="my-5 pt-5">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center my-5">
                  <h1 className="font-weight-bold text-error"><img src={errorImg} alt="" className="error-img"/></h1>
                  <h3 className="text-uppercase">Sorry, page not found</h3>
                  <div className="mt-5 text-center">
                    <div to="/" className="btn btn-primary waves-effect waves-light" >Back to Dashboard</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    )
  }
}

export default NotFoundPage
