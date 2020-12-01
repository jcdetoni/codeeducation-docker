FROM golang:1.14.1-alpine as builder
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -ldflags "-w -s" -installsuffix cgo -o main ./main.go

FROM scratch
COPY --from=builder /go/main .

ENTRYPOINT ["./main"]