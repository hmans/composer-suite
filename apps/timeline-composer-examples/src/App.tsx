import { ReactNode } from "react"
import { Delay, Lifetime, Repeat } from "timeline-composer"

const Box = ({ children }: { children?: ReactNode }) => (
	<div style={{ border: "1px solid black", padding: "1em", marginTop: "1em" }}>
		{children}
	</div>
)

const App = () => (
	<div style={{ width: 800, margin: "0 auto" }}>
		<h1>Timeline Composer Test</h1>
		<p>I'm immediately visible.</p>

		<p>
			A second from now, you will see a simple "animation", ahem, and it will repeat every
			6 seconds:
		</p>
		<Repeat seconds={6}>
			<Box>
				I'm <strong>repeating every 6 seconds</strong>!
				<Delay seconds={1}>
					<Box>
						I'm visible after a second. Something else will appear{" "}
						<strong>after 2 seconds</strong>:
						<Delay seconds={2}>
							<Lifetime seconds={2}>
								<Box>
									I'm visible after two seconds, but will{" "}
									<strong>disappear again after 2 seconds</strong>. See you later!
								</Box>
							</Lifetime>
						</Delay>
					</Box>
				</Delay>
			</Box>
		</Repeat>

		<Repeat seconds={1}>
			<Lifetime seconds={0.5}>
				<p>See</p>
			</Lifetime>

			<Delay seconds={0.5}>
				<p>Saw</p>
			</Delay>
		</Repeat>
	</div>
)

export default App
