import { ScoreUpdated} from "../../generated/ReputationManager/ReputationManager"
import { Manager } from "../../generated/schema"
import { convertToDecimal } from "../utils"
import { BI_18 } from "../utils/constants"


export function handleScoreUpdated(event: ScoreUpdated): void {
    let manager = new Manager(event.params.trader.toHexString())
    manager.reputationScore = convertToDecimal(event.params.score, BI_18)
    manager.save()
}