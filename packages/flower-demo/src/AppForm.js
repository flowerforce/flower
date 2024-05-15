import { store } from "./store"
import { Provider } from "react-redux"
import Flower, {
  FlowerNode,
  FlowerRoute,
  FlowerAction,
} from "@flowerforce/flower-react"
import { Text } from "./components/Text"
import { Button } from "./components/Button"
import { Input } from "./components/Input"
import Saga from "./components/Saga"
import { useFlower } from "@flowerforce/flower-react"

// Flower.registerComponents({ Text, Input })
// Devtools({ port: 8770 })

const Gianluca = ({ ...props }) => {
  const { onNext } = useFlower()
  return <div onClick={onNext}>Gianluca</div>
}

const Container = (
  <>
    <Gianluca
      show_rules={{
        "^app.username": {
          eq: "andrea",
        },
      }}
    />

    <Text id="username"></Text>
    <Input id="username"></Input>
    <Text
      rules={{
        "^app.username": {
          eq: "andreaz",
        },
      }}
    >
      CIAO ANDREA
    </Text>
    <pre style={{ backgroundColor: "red" }}>
      <Text id="username"></Text>
    </pre>
  </>
)

const Component = ({ id }) => {
  const { onChange, value, onShow } = useFlower({ id })

  return (
    <>
      <div style={{ backgroundColor: "orange" }}>
        {onShow({ "^app.username": { con: "1" } }) && "SHOW"}
        <input onChange={(e) => onChange("^app.username", e.target.value)} />
      </div>

      <Text rules={{ "^isValid": { eq: true } }}>OK {value}</Text>
    </>
  )
}

const Obj = { a: 1 }

function AppForm() {
  return (
    <FlowerNode
      id="A"
      to={{
        B: { and: [{ "^app.username": { eq: "andrea1" } }] },
        save: null,
      }}
    >
      <div className="paper">
        {Container}
        <Input
          id="^app.lastname"
          {...Obj}
          required={true}
          title="title2"
        />
        <hr />
        <Input
          id="^app.lastname"
          placeholder="asdas dasd"
          required={true}
        />
        <Component id="^app.username" />
        <Input id="as dad" title=" asdasd">
          <Button />
        </Input>
        <Gianluca />
      </div>
      {
        // <Text id="^app.lastname"></Text>
        // <Text value="asdasd" rules={{ "^app.lastname": { eq: "andrea" } }}></Text>
      }
    </FlowerNode>

  )
}

export default AppForm
