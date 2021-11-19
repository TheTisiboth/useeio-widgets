import { Grid } from "@material-ui/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Indicator, Matrix, NaicsMap, Sector, WebModel } from "useeio";
import { Config, Widget } from "../..";
import * as naics from "../../naics";
import { CommodityList } from "./commodity-list";




/**
 * The row type of the input or output list.
 */
export type IOFlow = {
    id: string,
    name: string,
    value: number,
    share: number,
};

interface TableData extends Sector {
    output:number;
    jobs: number
}
/**
 * A widget with 3 columns: inputs (upstream flows), commodities, and outputs
 * (downstream flows). The inputs and outputs are computed based on the
 * commodity selection and the direct coefficients matrix `A`. 
 */
export class JobsGrid extends Widget {

    private sectors: Sector[];
    private sectorIndex: { [code: string]: number };
    private indicators: Indicator[];
    private techMatrix: Matrix;
    private directImpacts: Matrix;
    private commoditySectors: Sector[] = [];
    private naicsMap: NaicsMap;
    public tableData: TableData[];
    constructor(
        private model: WebModel,
        private selector: string) {
        super();
    }

    async update(config: Config) {
        await this.initialize();
        // Lazy load the naicsMap
        if (config.naics !== undefined && this.naicsMap === undefined) {
            this.naicsMap = await NaicsMap.of(this.model);
        }
        this.commoditySectors = naics.filterByNAICS(
            config.naics, this.sectors, this.naicsMap);
        

        // render the three columns:
        // inputs | commodities | outputs
        ReactDOM.render(
            <>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={10} >
                        <CommodityList
                            config={config}
                            sectors={this.commoditySectors}
                            widget={this}
                        />
                    </Grid>
                   
                </Grid>
            </>,
            document.querySelector(this.selector)
        );
    }

    private async initialize() {
        const q = await this.model.matrix('q');
        const sectors = await this.model.sectors();
        const jobIndicator = (await this.model.indicators())
          .filter(i => i.code === 'JOBS')[0];
        const impacts = await this.model.matrix('D');
        this.tableData = sectors.map(sector => {
          const output = q.get(sector.index, 0);
          const jobs = output * impacts.get(jobIndicator.index, sector.index);
          return {
            ...sector,
            output: Math.round(output),
            jobs: Math.round(jobs)
          };
        });
    }

}
