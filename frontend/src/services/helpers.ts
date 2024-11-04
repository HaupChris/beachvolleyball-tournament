import {ITeam} from "../types/api";

export function getTeamName(team: ITeam): string {
    if (team.players.length > 0) {
        return team.players.sort((a, b) => a.last_name.localeCompare(b.last_name))
            .map(player => player.last_name)
            .join(' ')
    } else {
        return "";
    }
}