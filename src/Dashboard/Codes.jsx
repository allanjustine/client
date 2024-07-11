import React, { useState, useRef, useEffect } from "react";
import { Container, Card, CardContent, Grid, Button } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import QrReader from "react-qr-reader";
import { Link } from "react-router-dom";

function Codes({ someProp }) {
  const [scanResultFile, setScanResultFile] = useState("");
  const [scanResultWebCam, setScanResultWebCam] = useState("");
  const classes = useStyles();
  const qrRef = useRef(null);

  useEffect(() => {
    console.log("Changed: ", someProp);
  }, [someProp]);

  const handleErrorFile = (error) => {
    console.log(error);
  };

  const handleScanFile = (result) => {
    if (result) {
      setScanResultFile(result);
    }
  };

  const handleErrorWebCam = (error) => {
    console.log(error);
  };

  const handleScanWebCam = (result) => {
    if (result) {
      setScanResultWebCam(result);
    }
  };

  const onScanFile = () => {
    qrRef.current.openImageDialog();
  };

  return (
    <Container className={classes.container}>
      <Card>
        <h2 className={classes.title}>SCAN QR CODE</h2>
        <CardContent>
          <Grid container spacing={10} justifyContent="center">
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <Button
                className={classes.btn}
                variant="contained"
                color="secondary"
                onClick={onScanFile}
                style={{ marginBottom: "5px", marginTop: "-4px" }}
              >
                Upload QR Code to Scan
              </Button>
              <QrReader
                ref={qrRef}
                delay={300}
                style={{ width: "100%" }}
                onError={handleErrorFile}
                onScan={handleScanFile}
                legacyMode
              />
              <h3 className="mt-3">
                Computer ID:
                <br />
              </h3>
              {scanResultFile !== "[]"
                ? scanResultFile && (
                    <Link to={`/computers/${scanResultFile}`}>
                      <Button>
                        <b>{scanResultFile}</b>
                      </Button>
                    </Link>
                  )
                : scanResultFile && (
                    <Button>
                      <b>No computer id found.</b>
                    </Button>
                  )}
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Qr Code Scan by Camera
              </h3>
              <QrReader
                delay={300}
                style={{ width: "100%" }}
                onError={handleErrorWebCam}
                onScan={handleScanWebCam}
              />

              <h3 className="mt-3">
                Computer ID:
                <br />
              </h3>
              {scanResultWebCam && (
                <Link to={`/computers/${scanResultWebCam}`}>
                  <Button>
                    <b>{scanResultWebCam}</b>
                  </Button>
                </Link>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 10,
  },
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#3f51b5",
    color: "#fff",
    padding: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  btn: {
    marginTop: 10,
    marginBottom: 20,
  },
}));

export default Codes;
