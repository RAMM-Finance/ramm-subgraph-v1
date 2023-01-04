import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { MarketInitiated } from "../generated/schema"
import { MarketInitiated as MarketInitiatedEvent } from "../generated/Controller/Controller"
import { handleMarketInitiated } from "../src/controller"
import { createMarketInitiatedEvent } from "./controller-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let marketId = BigInt.fromI32(234)
    let recipient = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newMarketInitiatedEvent = createMarketInitiatedEvent(
      marketId,
      recipient
    )
    handleMarketInitiated(newMarketInitiatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("MarketInitiated created and stored", () => {
    assert.entityCount("MarketInitiated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "MarketInitiated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "marketId",
      "234"
    )
    assert.fieldEquals(
      "MarketInitiated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "recipient",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
