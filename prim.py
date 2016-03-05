class Primitives:

    def trunc(self, length, input):
        internal_input = str(input)
        if len(internal_input) > length:
            internal_input = internal_input[0:length]
            internal_input += "..."
            return internal_input
        else:
            return internal_input