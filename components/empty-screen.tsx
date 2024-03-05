import { ExternalLink } from "@/components/external-link";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";

const exampleMessages = [
  {
    heading: "Give me order value over time",
    message: "Give me order value over time",
  },
  {
    heading: "What's the total order value?",
    message: "What's the total order value?",
  },
  {
    heading: "Show me the total revenue for each product category.",
    message:
      "Show me the total revenue for each product category. Can you show me a bar chart?",
  },
];

export function EmptyScreen({
  submitMessage,
}: {
  submitMessage: (message: string) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8 mb-4">
        <h1 className="mb-2 text-lg font-semibold">
          snowBrain - AI-Driven Insights with Snowflake
        </h1>
        <div className="overflow-hidden">
          <p className="mb-2 leading-normal text-muted-foreground">
            SnowBrain is an AI-driven personal data analyst that simplifies
            complex data querying processes by automating SQL generation and
            visualization. Ask questions in natural language and receive
            AI-driven insights in SQL in real-time.
          </p>
          <p className="mb-2 leading-normal text-muted-foreground">
            The demo is built with{" "}
            <ExternalLink href="https://nextjs.org">Next.js</ExternalLink> and
            the{" "}
            <ExternalLink href="https://sdk.vercel.ai/docs">
              Vercel AI SDK
            </ExternalLink>
            .
          </p>
          <p className="mb-2 leading-normal text-muted-foreground">
            It uses{" "}
            <ExternalLink href="https://vercel.com/blog/ai-sdk-3-generative-ui">
              React Server Components
            </ExternalLink>{" "}
            to combine text with UI generated as output of the LLM. The UI state
            is synced through the SDK so the model is aware of your interactions
            as they happen.
          </p>
          <p className="leading-normal text-muted-foreground mb-4">
            Try an example:
          </p>
          <div className="flex flex-col items-start space-y-2">
            {exampleMessages.map((message, index) => (
              <Button
                key={index}
                variant="link"
                className="h-auto p-0 text-base flex items-start w-full"
                onClick={async () => {
                  submitMessage(message.message);
                }}
              >
                <div className="flex items-start w-full">
                  <IconArrowRight className="mr-2 text-muted-foreground flex-shrink-0" />
                  <p className="whitespace-pre-wrap text-left">
                    {message.heading}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* <p className="leading-normal text-muted-foreground text-[0.8rem] text-center">
        Note: This is not real financial advice.
      </p> */}
    </div>
  );
}
