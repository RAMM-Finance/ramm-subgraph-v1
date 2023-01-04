import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { MarketInitiated } from "../generated/Controller/Controller"

export function createMarketInitiatedEvent(
  marketId: BigInt,
  recipient: Address
): MarketInitiated {
  let marketInitiatedEvent = changetype<MarketInitiated>(newMockEvent())

  marketInitiatedEvent.parameters = new Array()

  marketInitiatedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  marketInitiatedEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )

  return marketInitiatedEvent
}
