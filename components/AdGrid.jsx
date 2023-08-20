import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AdCard from "./AdCard";
import { InferGetServerSidePropsType } from "next";
import LoginBtn from "./LoginButton";
import { useSession, signIn, signOut } from "next-auth/react";
import LogoutBtn from "./LogoutButton";
import { getSession } from "next-auth/react";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Album({ session }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Navigation Bar */}
      <AppBar position="relative" style={{ background: "gray" }}>
        <Toolbar>
          {/* <CameraIcon sx={{ mr: 2 }} /> */}
          <Link href="/">
            <Typography variant="h6" color="inherit" noWrap>
              AdsReveal
            </Typography>
          </Link>
          <div style={{ marginLeft: "auto" }}>
            <LogoutBtn />
          </div>
        </Toolbar>
      </AppBar>
      <main>
        {/* End Navigation Bar */}

        {/* Hero unit */}
        {/* Future: FILTER }
        {/* <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Album layout
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Something short and leading about the collection below—its
              contents, the creator, etc. Make it short and sweet, but not too
              short so folks don&apos;t simply skip over it entirely.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">Main call to action</Button>
              <Button variant="outlined">Secondary action</Button>
            </Stack>
          </Container>
        </Box> */}
        {/* End hero unit */}

        {/* Start Ad Grid */}
        <Container sx={{ py: 8 }} maxWidth="md">
          <AdCard />
        </Container>
        {/* End Ad Grid */}
      </main>

      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Snapchat Ads
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
