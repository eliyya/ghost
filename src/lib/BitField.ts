export interface RecursiveReadonlyArray<ItemType>
    extends ReadonlyArray<ItemType | RecursiveReadonlyArray<ItemType>> { }

export type BitFieldResolvable<
    Flags extends string,
    Type extends number | bigint,
> =
    | RecursiveReadonlyArray<
        Flags | Type | `${bigint}` | Readonly<BitField<Flags, Type>>
    >
    | Flags
    | Type
    | `${bigint}`
    | Readonly<BitField<Flags, Type>>

/**
 * Data structure that makes it easy to interact with a bitfield.
 */
export default class BitField<
    Flags extends string,
    Type extends number | bigint = number,
> {
    /**
     * Numeric bitfield flags.
     * <info>Defined in extension classes</info>
     * @type {Record<Flags, number|bigint>}
     * @abstract
     */
    static Flags = {}
    Flags = {}

    /**
     * @type {number|bigint}
     * @memberof BitField
     * @private
     */
    static DefaultBit = 0

    /**
     * Bitfield of the packed bits
     * @type {number|bigint}
     */
    bitfield: number | bigint

    /**
     * @param {BitFieldResolvable} [bits=BitField.DefaultBit] Bit(s) to read from
     */
    constructor(bits?: BitFieldResolvable<Flags, Type>) {
        /**
         * Bitfield of the packed bits
         * @type {number|bigint}
         */
        // @ts-ignore
        this.bitfield = this.constructor.resolve(
            bits ?? (BitField.DefaultBit as any),
        )
    }

    /**
     * The default bitfield for this BitField
     */
    get DefaultBit() {
        // @ts-ignore
        return this.constructor.DefaultBit
    }

    /**
     * Checks whether the bitfield has a bit, or any of multiple bits.
     * @param {BitFieldResolvable} bit Bit(s) to check for
     * @returns {boolean}
     */
    any(bit: BitFieldResolvable<Flags, Type>): boolean {
        // @ts-ignore
        return (
            ((this.bitfield as number) &
                // @ts-ignore
                (this.constructor.resolve(bit) as number)) !==
            this.DefaultBit
        )
    }

    /**
     * Checks if this bitfield equals another
     * @param {BitFieldResolvable} bit Bit(s) to check for
     * @returns {boolean}
     */
    equals(bit: BitFieldResolvable<Flags, Type>): boolean {
        // @ts-ignore
        return this.bitfield === this.constructor.resolve(bit)
    }

    /**
     * Checks whether the bitfield has a bit, or multiple bits.
     * @param {BitFieldResolvable} bit Bit(s) to check for
     * @returns {boolean}
     */
    has(bit: BitFieldResolvable<Flags, Type>) {
        // @ts-ignore
        const otbit = this.constructor.resolve(bit)
        return ((this.bitfield as number) & (otbit as number)) === otbit
    }

    /**
     * Gets all given bits that are missing from the bitfield.
     * @param {BitFieldResolvable} bits Bit(s) to check for
     * @param {...*} hasParams Additional parameters for the has method, if any
     * @returns {string[]}
     */
    missing(bits: BitFieldResolvable<Flags, Type>) {
        return new BitField(bits).remove(this).toArray()
    }

    /**
     * Freezes these bits, making them immutable.
     * @returns {Readonly<BitField>}
     */
    freeze() {
        return Object.freeze(this)
    }

    /**
     * Adds bits to these ones.
     * @param {...BitFieldResolvable} [bits] Bits to add
     * @returns {BitField} These bits or new BitField if the instance is frozen.
     */
    add(...bits: BitFieldResolvable<Flags, Type>[]): BitField<Flags, Type> {
        let total = this.DefaultBit
        for (const bit of bits) {
            // @ts-ignore
            total |= this.constructor.resolve(bit)
        }
        // @ts-ignore
        if (Object.isFrozen(this)) return new BitField(this.bitfield | total)
        // @ts-ignore
        this.bitfield |= total
        return this
    }

    /**
     * Removes bits from these.
     * @param {...BitFieldResolvable} [bits] Bits to remove
     * @returns {BitField} These bits or new BitField if the instance is frozen.
     */
    remove(...bits: BitFieldResolvable<Flags, Type>[]): BitField<Flags, Type> {
        let total = this.DefaultBit
        for (const bit of bits) {
            // @ts-ignore
            total |= this.constructor.resolve(bit)
        }
        // @ts-ignore
        if (Object.isFrozen(this)) return new BitField(this.bitfield & ~total)
        // @ts-ignore
        this.bitfield &= ~total
        return this
    }

    /**
     * Gets an object mapping field names to a {@link boolean} indicating whether the
     * bit is available.
     * @param {...*} hasParams Additional parameters for the has method, if any
     * @returns {Object}
     */
    serialize(): { [K in Flags]: boolean } {
        const serialized: { [K in Flags]: boolean } = {} as {
            [K in Flags]: boolean
        }
        for (const [flag, bit] of Object.entries(this.Flags)) {
            if (isNaN(Number(flag)))
                serialized[flag as Flags] = this.has(bit as any)
        }
        return serialized
    }

    /**
     * Gets an {@link Array} of bitfield names based on the bits available.
     * @param {...*} hasParams Additional parameters for the has method, if any
     * @returns {string[]}
     */
    toArray() {
        // @ts-ignore
        return [...this[Symbol.iterator]()]
    }

    toJSON() {
        return typeof this.bitfield === 'number' ?
            this.bitfield
            : this.bitfield.toString()
    }

    valueOf() {
        return this.bitfield
    }

    toString() {
        return this.bitfield.toString()
    }

    toPrimitive() {
        return this.bitfield
    }

    // @ts-ignore
    *[Symbol.iterator]() {
        for (const bitName of Object.keys(this.Flags)) {
            if (this.has(bitName as any)) yield bitName
        }
    }

    /**
     * Data that can be resolved to give a bitfield. This can be:
     * * A bit number (this can be a number literal or a value taken from {@link BitField.Flags})
     * * A string bit number
     * * An instance of BitField
     * * An Array of BitFieldResolvable
     * @typedef {number|string|bigint|BitField|BitFieldResolvable[]} BitFieldResolvable
     */

    /**
     * Resolves bitfields to their numeric form.
     * @param {BitFieldResolvable} [bit] bit(s) to resolve
     * @returns {number|bigint}
     */
    static resolve<Flags extends string, Type extends number | bigint = number>(
        bit: BitFieldResolvable<Flags, Type>,
    ): number | bigint {
        const { DefaultBit } = this
        if (typeof bit === 'number' && bit >= DefaultBit) return bit
        if (typeof bit === 'bigint' && bit >= BigInt(DefaultBit)) return bit
        if (bit instanceof BitField) return bit.bitfield
        if (Array.isArray(bit)) {
            return bit
                .map(bit_ => this.resolve(bit_))
                .reduce(
                    (prev, bit_) => BigInt(prev) | BigInt(bit_),
                    BigInt(DefaultBit),
                )
        }
        if (typeof bit === 'string') {
            if (!isNaN(Number(bit)))
                return typeof DefaultBit === 'bigint' ?
                    BigInt(bit)
                    : Number(bit)
            // @ts-ignore
            if (this.Flags[bit] !== undefined) return this.Flags[bit]
        }
        throw new Error(`Invalid bitfield flag or number: ${bit}`)
    }
}

export const AvailableDaysFlags = {
    Sunday: 1 << 0,
    Monday: 1 << 1,
    Tuesday: 1 << 2,
    Wednesday: 1 << 3,
    Thursday: 1 << 4,
    Friday: 1 << 5,
    Saturday: 1 << 6,
}

export class AvailableDaysBitfield<
    Type extends number | bigint = number,
> extends BitField<keyof typeof AvailableDaysFlags, Type> {
    static Flags = AvailableDaysFlags
    Flags = AvailableDaysFlags
}
