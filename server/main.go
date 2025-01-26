package main

import (
    "database/sql"
    "encoding/json"
    "log"
    "net/http"
    "os"
	"time"
    
    _ "github.com/lib/pq"
    "github.com/joho/godotenv"
	"github.com/rs/cors"
)

type ClassEvent struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Instructor  string `json:"instructor"`
	StartTime   string `json:"startTime"`
	EndTime     string `json:"endTime"`
	Capacity    int    `json:"capacity"`
	Enrolled    int    `json:"enrolled"`
	Price		float64 `json:"price"`
	Schedule    string `json:"schedule"`
}

func main() {
    godotenv.Load()
    
    db, err := sql.Open("postgres", 
        "host=" + os.Getenv("DB_HOST") +
        " user=" + os.Getenv("DB_USER") +
        " password=" + os.Getenv("DB_PASSWORD") +
        " dbname=" + os.Getenv("DB_NAME") +
        " port=" + os.Getenv("DB_PORT") +
		" sslmode=disable")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

	mux := http.NewServeMux()
    mux.HandleFunc("/api/classes", func(w http.ResponseWriter, r *http.Request) {
        rows, err := db.Query(`
			SELECT id, title, instructor, 
			CAST(start_time AT TIME ZONE 'UTC' AS TIME) as start_time,
			CAST(end_time AT TIME ZONE 'UTC' AS TIME) as end_time,
				capacity, enrolled, price, schedule 
			FROM classes`)
        if err != nil {
            http.Error(w, "Internal server error", 500)
            log.Println("Error fetching classes:", err)
            return
        }
        defer rows.Close()

		var classes []ClassEvent
		for rows.Next() {
			var c ClassEvent
			var rawStartTime, rawEndTime time.Time
			err := rows.Scan(&c.ID, &c.Title, &c.Instructor, &rawStartTime, 
				&rawEndTime, &c.Capacity, &c.Enrolled, &c.Price, &c.Schedule)
			if err != nil {
				http.Error(w, "Internal server error", 500)
				log.Println("Error scanning row:", err)
				return
			}
			c.StartTime = rawStartTime.Format("3:04 PM")
			c.EndTime = rawEndTime.Format("3:04 PM")
			classes = append(classes, c)
		}
        
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(classes)
    })

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(mux)
    log.Printf("Server running on port 3000")
	log.Fatal(http.ListenAndServe(":3000", handler))
}