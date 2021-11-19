import {
    Grid, Typography
} from "@material-ui/core";
import React from "react";
import { ReactTabulator } from "react-tabulator";
import 'react-tabulator/lib/css/tabulator_bootstrap4.min.css'; // theme
import 'react-tabulator/lib/styles.css'; // required styles
import { Tabulator } from "tabulator-tables";
import { Sector } from "useeio";
import { Config } from "../..";
import { JobsGrid } from "./jobs";


/**
 * Creates the list with the commodities for which the inputs and outputs
 * should be computed.
 */
export const CommodityList = (props: {
    sectors: Sector[],
    config: Config,
    widget: JobsGrid,
}) => {
    const tabulatorColumns : Tabulator.ColumnDefinition[] = [
        // Checkbox cell
      {title: "",formatter:"rowSelection", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, cellClick:function(e, cell){
        cell.getRow().toggleSelect();
      }},
      { title: "Commodity", field: "name", width: "35%" },
      { title: "Location", field: "location" },
      { title: "Total commodity output", field: "output" },
      { title: "Jobs", field: "jobs" },
    ];

    const tabulatorRows = props.widget.tableData;
  
    const tabulatorOptions={
      pagination:true,
      paginationSize:10
    };
      
    return (
        <Grid container direction="column" spacing={2}>
            <Grid item>
                <Typography variant="h6" component="span">
                    Commodities
            </Typography>
            </Grid>
            
            <Grid item style={{ width: "100%", height: 600 }}>
                <ReactTabulator 
                columns={tabulatorColumns}
                data={tabulatorRows}
                options={tabulatorOptions}
                />
            </Grid>
        </Grid>
    );
};
