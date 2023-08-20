import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import { Favorite } from "@mui/icons-material";
import { CalendarToday } from "@mui/icons-material";
import { Icon } from "@mui/material";
import { Public } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import ReactPlayer from "react-player/lazy";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const AdCard = () => {
  function BasicPagination() {
    return (
      <Stack spacing={2}>
        <Pagination count={10} color="primary" />
      </Stack>
    );
  }

  return (
    <>
      <Grid container spacing={4}>
        {cards.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={4}>
            <Card
              spacing={1}
              xs={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent>
                <Grid container justify="space-between" alignItems="center">
                  <Typography
                    gutterBottom
                    style={{ fontSize: "20px", fontWeight: "bolder" }}
                  >
                    {card.brandName}
                  </Typography>
                  <IconButton aria-label="add to favorites" sx={{ ml: "auto" }}>
                    <Icon>
                      <Favorite style={{ fontSize: "20px" }} />
                    </Icon>
                  </IconButton>
                </Grid>
              </CardContent>
              <CardContent
                sx={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize="small"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Icon style={{ marginRight: "10px" }}>
                        <CalendarToday />
                      </Icon>
                      Dec 23 2022 - Dec 23 2022
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize="small"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Icon style={{ marginRight: "10px" }}>
                        <Public />
                      </Icon>
                      United States
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              {/* <CardMedia
        component="img"
        sx={{
          // 16:9
          // pt: "56.25%",
          height: "100%",
        }}
        image="https://source.unsplash.com/random"
        alt="random"
      /> */}
              <CardMedia>
                <ReactPlayer
                  url={card.adContent}
                  controls={true}
                  width="100%"
                  height="100%"
                  wrapper="CardMedia"
                />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography>{card.brandDescription}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small">View</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* create a margin top component */}
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
      >
        <BasicPagination />
      </Box>
    </>
  );
};

export default AdCard;
