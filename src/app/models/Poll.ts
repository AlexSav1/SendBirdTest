import { PollChoice } from "./PollChoice";

export interface Poll {
    _id: string,
    title: string,
    voters: string[],
    choices: PollChoice[]
}