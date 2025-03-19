import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { ClipLoader } from 'react-spinners';

const Preloader = () => {
    return (
        <>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <div className="text-center d-flex justify-content-center align-content-center align-items-center" style={{ height: '100vh' }}>
                            <ClipLoader color='#000' size={70} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Preloader
