import { MarketInitiated as MarketInitiatedEvent } from "../generated/Controller/Controller"
import { MarketInitiated } from "../generated/schema"

export function handleMarketInitiated(event: MarketInitiatedEvent): void {
  let entity = new MarketInitiated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.marketId = event.params.marketId
  entity.recipient = event.params.recipient

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
