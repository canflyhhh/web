'use client'
import * as React from 'react';
import usePosts from './post/usePosts';
import { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button, Slide, 
    TransitionProps, Dialog, DialogTitle, DialogActions, DialogContentText, DialogContent
    , useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';


// post view - slide in
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
});
  


export default function Home() {
  // Destructure posts and setPosts from the usePosts hook
  const [posts, setPosts] = usePosts();
  const router = useRouter();

  return (
    <Grid container spacing={2}  sx={{ padding: 4 }}>
        {posts.map((post) => (
            <Grid item xs={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {post.title}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {post.account}
                        </Typography>
                        <Typography variant="body2">
                            {post.context.length > 50
                            ? `${post.context.substring(0, 50)}……`
                            : post.context}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" onClick={() => router.push("/post_context")}>
                            查看內容
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        ))}
    </Grid>
    
  );
}
