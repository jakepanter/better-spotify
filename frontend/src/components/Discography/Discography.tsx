/*
import Album from "../Album/Album";
import React from "react";

const { ids } = props;
if(ids === undefined) return <p>loading...</p>;

const albums = ids.map((id) => {
    return (
        <div key={id} style={{height: "40% !important"}}>
            <Album id={id} headerStyle={'full'}/>
        </div>
    )

});

return (<div>{albums}</div>)*/

import React, {Component} from "react";
import {ArtistsAlbumsResponse} from "spotify-types";
import { API_URL } from "../../utils/constants";
import Album from "../Album/Album";
//import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";


// The fetching limit, can be adjusted by changing this value
const limit = 30;
interface IProps {
    id: string;
}


interface IState {
    ids: string[];
}



class Discography extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            ids:[]
        };
    }
    async componentDidMount()
    {
        // Fetch albums, these include albums, singles and appears_on
        const allAlbums: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=${limit}&market=DE`
        ).then((res) => res.json());

        //filter all ids
        allAlbums.items.filter((album) => {
            this.setState({ ids: [...this.state.ids, album.id] })
        });
        console.log(this.state.ids)
    }


    render(){
        if(this.state.ids.length === 0) return <p>loading</p>
    return (
        <div>
            {this.state.ids.map((id)=> {
                return(
                <div key={id}>
                    <Album id={id} headerStyle={'full'} />
                </div>)
            })}
        </div>
    )}
}

export default Discography;